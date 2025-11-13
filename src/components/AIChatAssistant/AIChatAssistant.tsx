import React, { useState } from "react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatAssistantProps {
  context?: string; // e.g., "course" or "tutorial"
  contextTitle?: string; // The course/tutorial title
}

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  context = "learning",
  contextTitle,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hi! I'm your AI assistant. Ask me anything about ${
        contextTitle || "JavaScript variables"
      }.`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `I understand you're asking about: "${inputValue}". This is a simulated response. In production, this would connect to your AI backend to provide intelligent, context-aware answers about ${context}.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    // Auto-send the suggested question
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: question,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: `Great question! "${question}" - This is a simulated response about ${context}. In production, this would provide detailed explanations.`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
    }, 100);
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800 text-sm">AI Assistant</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className="overflow-x-hidden">
            {!message.isUser && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-800 break-words overflow-hidden">
                  {message.text}
                </div>
              </div>
            )}
            {message.isUser && (
              <div className="flex justify-end overflow-hidden">
                <div className="bg-blue-500 text-white rounded-lg px-4 py-3 text-sm max-w-[80%] break-words overflow-hidden">
                  {message.text}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Suggested Questions - Show only initially */}
        {messages.length === 1 && !isTyping && (
          <div className="space-y-2 mt-4">
            <button
              onClick={() =>
                handleSuggestedQuestion(
                  "What's the difference between 'let' and 'const'?"
                )
              }
              className="w-full text-left text-sm text-blue-600 bg-white hover:bg-blue-50 border border-blue-300 rounded-full px-4 py-2 transition-colors"
            >
              What's the difference between 'let' and 'const'?
            </button>
            <button
              onClick={() =>
                handleSuggestedQuestion('Explain "scope" with an example.')
              }
              className="w-full text-left text-sm text-blue-600 bg-white hover:bg-blue-50 border border-blue-300 rounded-full px-4 py-2 transition-colors"
            >
              Explain "scope" with an example.
            </button>
          </div>
        )}

        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg border border-gray-300 focus-within:border-blue-500 pr-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            className="flex-1 bg-transparent px-4 py-3 text-sm outline-none text-gray-700 placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg p-2 transition-colors flex-shrink-0"
            title="Send message"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatAssistant;
