import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import CodeEditor from "./Components/CodeEditor";

function EditorPage() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const state = location.state as {
    code?: string;
    language?: string;
    tutorialTitle?: string;
    exampleTitle?: string;
  } | null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
          ← <span className="text-xl font-bold text-white">CodeHub</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Code Editor</span>
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm">{user?.name || 'User'}</span>
            </div>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm text-gray-300 hover:text-white border border-gray-600 rounded hover:border-gray-500 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      {/* Code Editor */}
      <div className="flex-1">
        <CodeEditor 
          initialCode={state?.code}
          initialLanguage={state?.language}
          tutorialTitle={state?.tutorialTitle}
          exampleTitle={state?.exampleTitle}
        />
      </div>
    </div>
  );
}

export default EditorPage;
