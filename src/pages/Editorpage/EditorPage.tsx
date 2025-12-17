import { useLocation, useOutletContext } from "react-router-dom";
import AiAssistantPanel from "./Components/AiAssistantPanel";
import CodeEditor from "./Components/CodeEditor";
import { useState } from "react";

function EditorPage() {
  const location = useLocation();
  const [editorState, setEditorState] = useState({
    code: "",
    language: "python",
    error: "",
    problems: [] as any[],
  });
  
  const state = location.state as {
    code?: string;
    language?: string;
  } | null;

  return (
    <div className="flex">
      <CodeEditor 
        initialCode={state?.code}
        initialLanguage={state?.language}
        onStateChange={setEditorState}
      />
      <AiAssistantPanel 
        code={editorState.code}
        language={editorState.language}
        error={editorState.error}
        problems={editorState.problems}
      />
    </div>
  );
}

export default EditorPage;
