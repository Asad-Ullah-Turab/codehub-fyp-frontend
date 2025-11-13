import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import {
  handleLanguageChange,
  languageOptions,
  getDefaultCodeForLanguage,
} from "../../../functions";
import { codeAPI } from "../../../services/api";

export interface CodeEditorProps {
  initialCode?: string;
  initialLanguage?: string;
}

export default function CodeEditor({
  initialCode,
  initialLanguage,
}: CodeEditorProps) {
  // --- Your Existing State and Refs ---
  const [code, setCode] = useState(
    initialCode || getDefaultCodeForLanguage(initialLanguage || "python")
  );
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(initialLanguage || "python");
  const [input, setInput] = useState("");
  const outputEndRef = useRef<HTMLDivElement>(null);

  // --- New State for Tabs ---
  const [activeTab, setActiveTab] = useState<"output" | "input">("output");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFileName, setExportFileName] = useState("code");

  // --- Your Existing Functions (Unchanged) ---
  const runCode = async () => {
    setLoading(true);
    setOutput("");
    setActiveTab("output");

    try {
      const codeNeedsInput =
        code.includes("input(") ||
        code.includes("cin >>") ||
        code.includes("process.stdin");

      if (!input.trim() && codeNeedsInput) {
        setOutput(
          "⚠ Your code requires input!\n\nPlease provide input in the 'Input' tab.\nEach input should be on a separate line.\n\nExample:\nAlice\n25",
        );
        setLoading(false);
        return;
      }

      const result = await codeAPI.executeCode(code, language, input);

      if (result.success) {
        setOutput(result.data?.output || "No output");
      } else {
        setOutput(result.error || "Execution failed");
      }
    } catch (error: unknown) {
      const executionError = error as {
        response?: { data?: { message?: string } };
      };
      setOutput(
        executionError?.response?.data?.message ||
          "Error: Failed to execute code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (newLanguage: string) => {
    handleLanguageChange(newLanguage, setLanguage, setCode);
    setOutput("");
  };

  const handleImportCode = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js,.py,.cpp,.c,.h,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setCode(content);
          
          // Auto-select language based on file extension
          const fileName = file.name.toLowerCase();
          if (fileName.endsWith('.js')) {
            setLanguage('javascript');
          } else if (fileName.endsWith('.py')) {
            setLanguage('python');
          } else if (fileName.endsWith('.cpp') || fileName.endsWith('.c') || fileName.endsWith('.h')) {
            setLanguage('cpp');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExportCode = () => {
    setExportFileName("code");
    setShowExportModal(true);
  };

  const confirmExport = () => {
    const fileExtensions: { [key: string]: string } = {
      javascript: 'js',
      python: 'py',
      cpp: 'cpp'
    };
    const extension = fileExtensions[language] || 'txt';
    
    if (!exportFileName.trim()) return;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportFileName.trim()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  return (
    <div className="flex flex-3 flex-col h-screen">
      <div className="flex flex-col flex-2 bg-gray-50 overflow-hidden">
        {/* Editor Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300">
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="px-3 py-1 rounded bg-white text-gray-900 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languageOptions.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <button
              onClick={handleImportCode}
              title="Import Code"
              className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Import
            </button>
            <button
              onClick={handleExportCode}
              title="Export Code"
              className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Export
            </button>
            <button
              onClick={runCode}
              disabled={loading}
              className="px-3 py-1 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Running...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Run
                </>
              )}
            </button>
            <button
              onClick={() => setCode(getDefaultCodeForLanguage(language))}
              className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </div>
        <Editor
          height="100%"
          language={language === "cpp" ? "cpp" : language}
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{ minimap: { enabled: false } }}
        />
      </div>

      {/* Bottom: Output/Input Panel */}
      <div className="flex flex-col flex-1 bg-gray-50 border-t border-gray-300">
        {/* Tab Headers */}
        <div className="flex items-center justify-between px-4 border-b border-gray-300">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("output")}
              className={`px-4 py-2 text-sm ${
                activeTab === "output"
                  ? "text-gray-900 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Output
            </button>
            <button
              onClick={() => setActiveTab("input")}
              className={`px-4 py-2 text-sm ${
                activeTab === "input"
                  ? "text-gray-900 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Input
            </button>
          </div>
          {activeTab === "output" && (
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                title="Copy"
                className="text-gray-500 hover:text-gray-800 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => setOutput("")}
                title="Clear"
                className="text-gray-500 hover:text-gray-800 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
        {/* Tab Content */}
        <div className="flex-1 p-3 overflow-auto bg-white">
          {activeTab === "output" ? (
            <pre className="text-sm whitespace-pre-wrap font-mono text-gray-800">
              {output || "Your code's output will be displayed here."}
              <div ref={outputEndRef} />
            </pre>
          ) : (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full p-2 rounded bg-white text-gray-900 border border-gray-300 resize-none text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Provide all inputs here (one per line)..."
            />
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Code</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filename (without extension)
              </label>
              <input
                type="text"
                value={exportFileName}
                onChange={(e) => setExportFileName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirmExport()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter filename"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                File will be saved as: {exportFileName || 'code'}.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'cpp'}
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmExport}
                disabled={!exportFileName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
