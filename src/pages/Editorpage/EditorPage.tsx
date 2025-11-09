import { useLocation } from "react-router-dom";
import AiAssistantPanel from "./Components/AiAssistantPanel";
import CodeEditor from "./Components/CodeEditor";

function EditorPage() {
  const location = useLocation();
  
  const state = location.state as {
    code?: string;
    language?: string;
  } | null;

  return (
    <div className="flex">
      <CodeEditor 
        initialCode={state?.code}
        initialLanguage={state?.language}
      />
      <AiAssistantPanel />
    </div>
  );
}

export default EditorPage;
