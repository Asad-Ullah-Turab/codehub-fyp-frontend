function AiAssistantPanel() {
  return (
    <div className="flex flex-col flex-[1] bg-gray-50 overflow-hidden">
      {/* Assistant Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-300 flex-shrink-0">
        <h2 className="font-semibold text-gray-900">AI Assistant</h2>
        <button className="text-gray-500 hover:text-gray-800" title="Settings">
          {/* Using a simple gear emoji for placeholder */}
          ⚙️
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Example Message */}
        <div className="flex flex-col gap-2">
          <div className="p-3 rounded-lg bg-white border border-gray-300 text-sm text-gray-800 max-w-[85%] self-start">
            Hello! I'm your AI assistant. How can I help you today?
          </div>
        </div>
        {/* Add more messages here */}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-gray-300 bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <input
            type="text"
            placeholder="Ask the AI anything..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500"
          />
          <button className="text-blue-600 hover:text-blue-500" title="Send">
            {/* Using a simple arrow emoji for placeholder */}➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default AiAssistantPanel;
