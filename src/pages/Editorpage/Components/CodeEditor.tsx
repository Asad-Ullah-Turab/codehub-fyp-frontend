import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  handleLanguageChange,
  languageOptions,
  getDefaultCodeForLanguage,
} from "../../../functions";
import { codeAPI } from "../../../services/api";

interface CodeEditorProps {
  initialCode?: string;
  initialLanguage?: string;
  tutorialTitle?: string;
  exampleTitle?: string;
}

function CodeEditor({
  initialCode,
  initialLanguage,
  tutorialTitle,
  exampleTitle,
}: CodeEditorProps) {
  const [code, setCode] = useState(() => {
    if (initialCode && initialLanguage) {
      return initialCode;
    }
    return getDefaultCodeForLanguage("python");
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(initialLanguage || "python");
  const [input, setInput] = useState("");

  const runCode = async () => {
    setLoading(true);
    setOutput("");

    try {
      // Check if code likely needs input but none provided
      const codeNeedsInput =
        code.includes("input(") ||
        code.includes("cin >>") ||
        code.includes("process.stdin");

      if (!input.trim() && codeNeedsInput) {
        setOutput(
          "⚠️ Your code requires input!\n\nPlease provide input in the 'Pre-provided Input' box above.\nEach input should be on a separate line.\n\nExample:\nAlice\n25"
        );
        setLoading(false);
        return;
      }

      // Regular execution with pre-provided input
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
          "Error: Failed to execute code. Please try again."
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
    <div className="flex flex-col h-full">
      {/* Tutorial Info Banner */}
      {tutorialTitle && (
        <div className="bg-purple-900 border-b border-purple-700 px-4 py-2 text-sm text-purple-100">
          <span className="font-semibold">📚 Tutorial:</span> {tutorialTitle}
          {exampleTitle && (
            <span className="ml-4">
              <span className="font-semibold">Example:</span> {exampleTitle}
            </span>
          )}
        </div>
      )}

      <div className="flex h-full">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-4 p-2 bg-gray-800 border-b border-gray-700">
            <label className="text-gray-200">Language:</label>
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="px-3 py-1 rounded bg-gray-700 text-gray-200 border border-gray-600"
            >
              {languageOptions.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <Editor
            height="100%"
            language={language === "cpp" ? "cpp" : language}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            className="border-r border-gray-700"
          />
        </div>
        <div className="flex flex-col flex-1 bg-gray-900 text-gray-200">
          <div className="flex gap-2 m-2">
            <button
              onClick={runCode}
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "⏳ Running..." : "▶ Run Code"}
            </button>
          </div>

          <div className="mx-2 mb-2">
            <label className="block text-sm text-gray-400 mb-1">
              Pre-provided Input (optional):
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-16 p-2 rounded bg-gray-800 text-gray-200 border border-gray-600 resize-none text-xs"
              placeholder="Provide all inputs here (one per line)..."
            />
          </div>

          <div className="flex-1 mx-2 mb-2 flex flex-col">
            <label className="block text-sm text-gray-400 mb-1">Output:</label>
            <div className="flex-1 relative">
              <pre className="h-full p-3 rounded bg-gray-800 overflow-auto text-sm whitespace-pre-wrap font-mono">
                {output || "Run your code to see output here..."}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
