import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = ({ energyData = [], currentHomeId = null, homeData = [] }) => {
  const [messages, setMessages] = useState([
    { 
      text: `Hello! I'm your Energy Assistant for Home ${currentHomeId}. I can analyze your energy consumption patterns and provide personalized advice based on your data.`,
      sender: 'bot' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInputMessage('');
    setIsTyping(true);

    // Generate bot response based on data
    setTimeout(() => {
      const botResponse = generateResponse(userMessage);
      setIsTyping(false);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 1500);
  };

  // Analyze energy data functions
  const getTotalConsumption = (data) => {
    return data.reduce((total, record) => total + parseFloat(record['Energy Consumption (kWh)'] || 0), 0);
  };

  const getConsumptionByAppliance = (data) => {
    const applianceMap = {};
    data.forEach(record => {
      const appliance = record['Appliance Type'];
      const consumption = parseFloat(record['Energy Consumption (kWh)'] || 0);
      applianceMap[appliance] = (applianceMap[appliance] || 0) + consumption;
    });
    return applianceMap;
  };

  const getConsumptionBySeason = (data) => {
    const seasonMap = {};
    data.forEach(record => {
      const season = record['Season'];
      const consumption = parseFloat(record['Energy Consumption (kWh)'] || 0);
      seasonMap[season] = (seasonMap[season] || 0) + consumption;
    });
    return seasonMap;
  };

  const getHighestConsumptionAppliance = (data) => {
    const applianceConsumption = getConsumptionByAppliance(data);
    const sorted = Object.entries(applianceConsumption).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0] : ['No data', 0];
  };

  const getPeakUsageTime = (data) => {
    const timeMap = {};
    data.forEach(record => {
      const hour = parseInt(record['Time'].split(':')[0]);
      const consumption = parseFloat(record['Energy Consumption (kWh)'] || 0);
      timeMap[hour] = (timeMap[hour] || 0) + consumption;
    });
    const sorted = Object.entries(timeMap).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0] : [12, 0];
  };

  const generateResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Data-driven responses
    if (lowerMessage.includes('total') || lowerMessage.includes('how much') || lowerMessage.includes('consumption')) {
      const total = getTotalConsumption(homeData);
      const applianceBreakdown = getConsumptionByAppliance(homeData);
      const breakdownText = Object.entries(applianceBreakdown)
        .map(([appliance, consumption]) => `${appliance}: ${consumption.toFixed(2)} kWh`)
        .join(', ');
      
      return `📊 Your total energy consumption is **${total.toFixed(2)} kWh**. \n\nBreakdown by appliance: ${breakdownText}.`;
    }

    if (lowerMessage.includes('highest') || lowerMessage.includes('most energy') || lowerMessage.includes('top appliance')) {
      const [appliance, consumption] = getHighestConsumptionAppliance(homeData);
      if (consumption > 0) {
        return `⚡ Your **${appliance}** uses the most energy at **${consumption.toFixed(2)} kWh**. \n\n💡 Consider using it during off-peak hours or upgrading to a more efficient model.`;
      }
    }

    if (lowerMessage.includes('season') || lowerMessage.includes('winter') || lowerMessage.includes('summer')) {
      const seasonConsumption = getConsumptionBySeason(homeData);
      const seasonText = Object.entries(seasonConsumption)
        .map(([season, consumption]) => `${season}: ${consumption.toFixed(2)} kWh`)
        .join(', ');
      
      return `🌤️ Your seasonal energy consumption: \n**${seasonText}**.`;
    }

    if (lowerMessage.includes('time') || lowerMessage.includes('peak') || lowerMessage.includes('when')) {
      const [hour, consumption] = getPeakUsageTime(homeData);
      const timePeriod = hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
      return `⏰ Your peak energy usage is around **${timePeriod}** with **${consumption.toFixed(2)} kWh**. \n\n💡 Consider shifting some usage to off-peak hours (before 4 PM or after 9 PM).`;
    }

    if (lowerMessage.includes('appliance') || lowerMessage.includes('device')) {
      const applianceConsumption = getConsumptionByAppliance(homeData);
      const applianceList = Object.entries(applianceConsumption)
        .map(([appliance, consumption]) => `• ${appliance}: **${consumption.toFixed(2)} kWh**`)
        .join('\n');
      
      return `🔌 Your appliances and their consumption: \n${applianceList}`;
    }

    if (lowerMessage.includes('reduce') || lowerMessage.includes('save') || lowerMessage.includes('tip')) {
      const [highestAppliance, highestConsumption] = getHighestConsumptionAppliance(homeData);
      
      if (highestConsumption > 0) {
        let specificTip = "";
        switch(highestAppliance.toLowerCase()) {
          case 'heater':
            specificTip = "Consider setting your thermostat 1-2 degrees lower in winter to save 5-10% on heating costs.";
            break;
          case 'air conditioning':
            specificTip = "Set your thermostat 1-2 degrees higher in summer and use fans to circulate air.";
            break;
          case 'oven':
            specificTip = "Use microwave or toaster oven for small meals instead of the full oven to save energy.";
            break;
          case 'lights':
            specificTip = "Switch to LED bulbs which use 75% less energy than incandescent bulbs.";
            break;
          case 'fridge':
            specificTip = "Ensure your refrigerator door seals are tight and avoid opening frequently.";
            break;
          default:
            specificTip = "Turn off appliances when not in use and use power strips to eliminate phantom load.";
        }
        
        return `💡 Based on your usage, your **${highestAppliance}** consumes the most energy (**${highestConsumption.toFixed(2)} kWh**). \n\n${specificTip} \n\n⏰ Using appliances during off-peak hours can reduce costs by 10-20%.`;
      }
    }

    if (lowerMessage.includes('bill') || lowerMessage.includes('cost') || lowerMessage.includes('money')) {
      const total = getTotalConsumption(homeData);
      const estimatedCost = (total * 0.15).toFixed(2);
      return `💰 Based on your consumption of **${total.toFixed(2)} kWh**, your estimated monthly cost is about **$${estimatedCost}** (at $0.15/kWh). \n\n📈 Actual cost depends on your local utility rates.`;
    }

    if (lowerMessage.includes('compare') || lowerMessage.includes('average')) {
      const total = getTotalConsumption(homeData);
      const householdSize = homeData[0]?.['Household Size'] || 1;
      const avgPerPerson = (total / parseInt(householdSize)).toFixed(2);
      
      return `👥 Your household of **${householdSize}** uses **${total.toFixed(2)} kWh** total, about **${avgPerPerson} kWh per person**. \n\n📊 The average person uses 200-300 kWh monthly.`;
    }

    // Default response
    return "🤖 I can analyze your energy consumption patterns, identify high-usage appliances, provide seasonal insights, and offer personalized saving tips. \n\nTry asking me about: \n• Your total consumption 📊\n• Highest energy appliance ⚡\n• Seasonal usage patterns 🌤️\n• Energy saving tips 💡\n• Cost estimation 💰";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "What's my total energy consumption?",
    "Which appliance uses the most energy?",
    "How does my usage vary by season?",
    "What are some energy saving tips?",
    "When is my peak usage time?",
    "How much does my energy cost?"
  ];

  const formatMessage = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
        <br />
      </span>
    ));
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot">
        <div className="chatbot-header">
          <div className="chatbot-avatar">⚡</div>
          <div className="chatbot-info">
            <h2>Energy Assistant</h2>
            <p>Home {currentHomeId} • Analyzing your energy patterns</p>
          </div>
          <div className="chatbot-status">
            <div className="status-indicator"></div>
            <span>Online</span>
          </div>
        </div>
        
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message-container ${message.sender}`}>
              <div className={`message ${message.sender}`}>
                <div className="message-content">
                  {formatMessage(message.text)}
                </div>
                <div className="message-time">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message-container bot">
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="suggested-questions">
          <div className="suggestions-header">
            <span>Quick questions:</span>
          </div>
          <div className="suggestions-grid">
            {suggestedQuestions.map((question, index) => (
              <button 
                key={index} 
                className="suggestion-btn"
                onClick={() => setInputMessage(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
        
        <div className="chatbot-input-container">
          <div className="chatbot-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your energy consumption..."
              maxLength="500"
            />
            <button 
              onClick={handleSend} 
              disabled={!inputMessage.trim()}
              className="send-btn"
            >
              <span>Send</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
          <div className="input-hint">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;