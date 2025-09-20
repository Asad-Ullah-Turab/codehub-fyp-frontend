import { useState } from "react";
import Editor from "@monaco-editor/react";

function CodeEditor() {
  const [code, setCode] = useState("// write your code here...");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setOutput("Running...");

    try {
      const response = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: "cpp" }),
      });

      const data = await response.json();
      setOutput(data.output || "No output");
    } catch (err) {
      if (err instanceof Error) {
        setOutput("Error: " + err.message);
      } else {
        setOutput("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[90vh]">
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="cpp"
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          className="border-r border-gray-700"
        />
      </div>
      <div className="flex flex-col flex-1 bg-gray-900 text-gray-200">
        <button
          onClick={runCode}
          disabled={loading}
          className="m-2 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "⏳ Running..." : "▶ Run Code"}
        </button>
        <pre className="flex-1 m-2 p-3 rounded bg-gray-800 overflow-auto">
          {output}
        </pre>
      </div>
    </div>
  );
}

export default CodeEditor;
