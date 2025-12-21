import { useLocation } from "react-router-dom";
import AiAssistantPanel from "./Components/AiAssistantPanel";
import CodeEditor from "./Components/CodeEditor";
import React, { useState, useRef, useCallback } from "react";

function EditorPage() {
  const location = useLocation();
  const [editorState, setEditorState] = useState({
    code: "",
    language: "python",
    error: "",
    problems: [] as any[],
  });

  // Resizable AI panel state
  const [aiPanelWidth, setAiPanelWidth] = useState(400); // Default width in pixels
  const [previousWidth, setPreviousWidth] = useState(400); // Store width when minimized
  const [isResizing, setIsResizing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const state = location.state as {
    code?: string;
    language?: string;
  } | null;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = containerRect.right - e.clientX;
    
    // Set min/max width constraints
    const minWidth = 250;
    const maxWidth = Math.min(containerRect.width * 0.6, 800); // Max 60% of container or 800px
    
    const clampedWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
    setAiPanelWidth(clampedWidth);
    setPreviousWidth(clampedWidth); // Store as previous width
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add mouse event listeners
  React.useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (isResizing) {
        handleMouseMove(e);
      }
    };

    const handleUp = () => {
      if (isResizing) {
        handleMouseUp();
      }
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    
    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Handle window resize to keep AI panel within bounds
  React.useEffect(() => {
    const handleWindowResize = () => {
      if (!isMinimized && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const maxAllowedWidth = Math.min(containerRect.width * 0.6, 800);
        
        if (aiPanelWidth > maxAllowedWidth) {
          const newWidth = Math.max(250, maxAllowedWidth);
          setAiPanelWidth(newWidth);
          setPreviousWidth(newWidth);
        }
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [aiPanelWidth, isMinimized]);

  const toggleMinimize = () => {
    if (isMinimized) {
      // When expanding, restore previous width but validate against current screen size
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const maxAllowedWidth = Math.min(containerRect.width * 0.6, 800);
        const targetWidth = Math.min(previousWidth, maxAllowedWidth);
        const finalWidth = Math.max(250, targetWidth); // Ensure minimum width
        
        setAiPanelWidth(finalWidth);
      }
    } else {
      // When minimizing, store current width
      setPreviousWidth(aiPanelWidth);
    }
    setIsMinimized(!isMinimized);
  };

  return (
    <div ref={containerRef} className="flex h-screen overflow-hidden">
      {/* Code Editor - takes remaining space */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <CodeEditor 
          initialCode={state?.code}
          initialLanguage={state?.language}
          onStateChange={setEditorState}
        />
      </div>
      
      {/* Resize Handle */}
      {!isMinimized && (
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize flex-shrink-0 transition-colors duration-150 relative group"
        >
          <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
            <div className="w-1 h-8 bg-gray-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      )}
      
      {/* AI Panel with toggle button */}
      <div 
        className={`relative bg-gray-50 transition-all duration-300 flex-shrink-0 ${
          isMinimized ? 'w-12' : ''
        }`}
        style={{ 
          width: isMinimized ? '48px' : `${Math.min(aiPanelWidth, window.innerWidth * 0.6)}px`,
          minWidth: isMinimized ? '48px' : '250px',
          maxWidth: isMinimized ? '48px' : '800px'
        }}
      >
        {/* Minimize/Maximize Toggle */}
        <button
          onClick={toggleMinimize}
          className="absolute top-3 left-3 z-10 w-6 h-6 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center text-xs transition-colors"
          title={isMinimized ? "Expand AI Chat" : "Minimize AI Chat"}
        >
          {isMinimized ? "→" : "←"}
        </button>
        
        {!isMinimized && (
          <AiAssistantPanel 
            code={editorState.code}
            language={editorState.language}
            error={editorState.error}
            problems={editorState.problems}
          />
        )}
      </div>
    </div>
  );
}

export default EditorPage;
