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
          "⚠️ Your code requires input!\n\nPlease provide input in the 'Input' tab.\nEach input should be on a separate line.\n\nExample:\nAlice\n25",
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
              onClick={runCode}
              disabled={loading}
              className="px-3 py-1 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "⏳ Running..." : "▶ Run"}
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
                className="text-gray-500 hover:text-gray-800"
              >
                📋
              </button>
              <button
                onClick={() => setOutput("")}
                title="Clear"
                className="text-gray-500 hover:text-gray-800"
              >
                🗑️
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
    </div>
  );
}
