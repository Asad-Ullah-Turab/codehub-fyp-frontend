import { useLocation } from "react-router-dom";
import { useSuspensionCheck } from "../../hooks/useSuspensionCheck";
import AiAssistantPanel from "./Components/AiAssistantPanel";
import CodeEditor from "./Components/CodeEditor";

function EditorPage() {
  const location = useLocation();
  const isNotSuspended = useSuspensionCheck();
  
  const state = location.state as {
    code?: string;
    language?: string;
    tutorialTitle?: string;
    exampleTitle?: string;
  } | null;

  if (!isNotSuspended) {
    return null; // Will redirect via hook
  }

  return (
    <div className="flex">
      <CodeEditor 
        initialCode={state?.code}
        initialLanguage={state?.language}
        tutorialTitle={state?.tutorialTitle}
        exampleTitle={state?.exampleTitle}
      />
      <AiAssistantPanel />
    </div>
  );
}

export default EditorPage;
