import { Link } from "react-router-dom";
import CodeEditor from "./Components/CodeEditor";

function EditorPage() {
  return (
    <div className="h-screen flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
          ← <span className="text-xl font-bold text-white">CodeHub</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Code Editor</span>
          <div className="flex gap-2">
            <Link
              to="/signin"
              className="px-3 py-1 text-sm text-gray-300 hover:text-white border border-gray-600 rounded hover:border-gray-500 transition"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Code Editor */}
      <div className="flex-1">
        <CodeEditor />
      </div>
    </div>
  );
}

export default EditorPage;
