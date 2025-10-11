import { useState } from "react";
import Editor from "@monaco-editor/react";
import { 
  handleCodeExecution,
  handleLanguageChange,
  languageOptions,
  getDefaultCodeForLanguage 
} from "../../../functions";

function CodeEditor() {
  const [code, setCode] = useState(getDefaultCodeForLanguage("javascript"));
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [input, setInput] = useState("");

  const runCode = async () => {
    await handleCodeExecution(code, language, input, setOutput, setLoading);
  };

  const changeLanguage = (newLanguage: string) => {
    handleLanguageChange(newLanguage, setLanguage, setCode);
    setOutput("");
  };

  return (
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
            Input (optional):
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-20 p-2 rounded bg-gray-800 text-gray-200 border border-gray-600 resize-none"
            placeholder="Enter input for your program..."
          />
        </div>

        <div className="flex-1 mx-2 mb-2">
          <label className="block text-sm text-gray-400 mb-1">Output:</label>
          <pre className="h-full p-3 rounded bg-gray-800 overflow-auto text-sm">
            {output || "Run your code to see output here..."}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
