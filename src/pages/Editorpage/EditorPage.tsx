import AiAssistantPanel from "./Components/AiAssistantPanel";
import CodeEditor from "./Components/CodeEditor";

function EditorPage() {
  return (
    <div className="flex">
      <CodeEditor />
      <AiAssistantPanel />
    </div>
  );
}

export default EditorPage;
