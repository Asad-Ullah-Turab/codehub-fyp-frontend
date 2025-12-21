import { useState, useRef, useEffect } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import type * as monacoType from "monaco-editor";
import { AlertCircle, AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";
import {
  handleLanguageChange,
  languageOptions,
  getDefaultCodeForLanguage,
} from "../../../functions";
import { codeAPI } from "../../../services/api";
import { snippetAPI, type CodeSnippet } from "../../../services/snippetAPI";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../contexts/ToastContext";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import { checkPythonSyntax, checkJavaScriptSyntax, checkCppSyntax, type ValidationError } from "../../../utils/codeValidation";

// Local Storage keys for code persistence
const STORAGE_KEYS = {
  CODE: 'codehub_editor_code',
  LANGUAGE: 'codehub_editor_language',
  INPUT: 'codehub_editor_input'
};

// Functions for localStorage persistence
const saveCodeToStorage = (code: string, language: string, input: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CODE, code);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    localStorage.setItem(STORAGE_KEYS.INPUT, input);
  } catch (error) {
    console.warn('Failed to save code to localStorage:', error);
  }
};

const loadCodeFromStorage = () => {
  try {
    return {
      code: localStorage.getItem(STORAGE_KEYS.CODE),
      language: localStorage.getItem(STORAGE_KEYS.LANGUAGE),
      input: localStorage.getItem(STORAGE_KEYS.INPUT)
    };
  } catch (error) {
    console.warn('Failed to load code from localStorage:', error);
    return { code: null, language: null, input: null };
  }
};

const clearCodeFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CODE);
    localStorage.removeItem(STORAGE_KEYS.LANGUAGE);
    localStorage.removeItem(STORAGE_KEYS.INPUT);
  } catch (error) {
    console.warn('Failed to clear code from localStorage:', error);
  }
};

export interface CodeEditorProps {
  initialCode?: string;
  initialLanguage?: string;
  onStateChange?: (state: { code: string; language: string; error: string; problems: any[] }) => void;
}

export default function CodeEditor({
  initialCode,
  initialLanguage,
  onStateChange,
}: CodeEditorProps) {
  // Load from localStorage if no initial values provided
  const savedData = loadCodeFromStorage();
  const getInitialCode = () => {
    if (initialCode) return initialCode;
    if (savedData.code) return savedData.code;
    return getDefaultCodeForLanguage(initialLanguage || savedData.language || "python");
  };
  const getInitialLanguage = () => {
    if (initialLanguage) return initialLanguage;
    if (savedData.language) return savedData.language;
    return "python";
  };
  const getInitialInput = () => {
    return savedData.input || "";
  };

  // --- Your Existing State and Refs ---
  const [code, setCode] = useState(getInitialCode());
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(getInitialLanguage());
  const [input, setInput] = useState(getInitialInput());
  const outputEndRef = useRef<HTMLDivElement>(null);

  // --- New State for Tabs ---
  const [activeTab, setActiveTab] = useState<"output" | "input" | "problems">("output");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFileName, setExportFileName] = useState("code");
  
  // --- State for Error Detection ---
  const [problems, setProblems] = useState<Array<{
    severity: 'error' | 'warning' | 'info';
    message: string;
    line: number;
    column: number;
  }>>([]);
  const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  
  // --- State for Saved Snippets ---
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [showSnippetsPanel, setShowSnippetsPanel] = useState(false);
  const [loadingSnippets, setLoadingSnippets] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; snippetId: string | null }>({
    show: false,
    snippetId: null,
  });

  // --- Load Snippets on Mount ---
  useEffect(() => {
    if (isAuthenticated) {
      loadSnippets();
    }
  }, [isAuthenticated]);

  // --- Show recovery notification if code was loaded from localStorage ---
  useEffect(() => {
    const savedData = loadCodeFromStorage();
    if (!initialCode && savedData.code && savedData.code !== getDefaultCodeForLanguage(savedData.language || 'python')) {
      showToast("💾 Code recovered from previous session", "info");
    }
  }, []);

  // --- Update parent component with code changes in real-time ---
  useEffect(() => {
    // Notify parent of code changes immediately
    onStateChange?.({ code, language, error: "", problems });
  }, [code, language, problems, onStateChange]);

  // --- Save code to localStorage whenever it changes ---
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveCodeToStorage(code, language, input);
    }, 1000); // Debounce saves by 1 second

    return () => clearTimeout(timeoutId);
  }, [code, language, input]);

  const loadSnippets = async () => {
    try {
      setLoadingSnippets(true);
      const result = await snippetAPI.getUserSnippets();
      setSnippets(result.data);
    } catch (error) {
      console.error("Error loading snippets:", error);
    } finally {
      setLoadingSnippets(false);
    }
  };

  const handleSaveSnippet = async () => {
    if (!saveTitle.trim()) return;

    try {
      await snippetAPI.createSnippet({
        title: saveTitle.trim(),
        language,
        code,
        output,
      });
      setSaveTitle("");
      setShowSaveModal(false);
      await loadSnippets();
      showToast("Code snippet saved successfully!", "success");
    } catch (error) {
      console.error("Error saving snippet:", error);
      showToast(error instanceof Error ? error.message : "Failed to save snippet", "error");
    }
  };

  const handleLoadSnippet = async (snippet: CodeSnippet) => {
    setCode(snippet.code);
    setLanguage(snippet.language);
    setOutput(snippet.output || "");
    setShowSnippetsPanel(false);
    clearCodeFromStorage(); // Clear since we're intentionally loading new code
    showToast("Code snippet loaded!", "success");
  };

  const confirmDeleteSnippet = (id: string) => {
    setDeleteConfirm({ show: true, snippetId: id });
  };

  const handleDeleteSnippet = async () => {
    if (!deleteConfirm.snippetId) return;

    try {
      await snippetAPI.deleteSnippet(deleteConfirm.snippetId);
      await loadSnippets();
      showToast("Snippet deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting snippet:", error);
      showToast(error instanceof Error ? error.message : "Failed to delete snippet", "error");
    } finally {
      setDeleteConfirm({ show: false, snippetId: null });
    }
  };

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
          "⚠ Your code requires input!\n\nPlease provide input in the 'Input' tab.\nEach input should be on a separate line.\n\nExample:\nAlice\n25",
        );
        setLoading(false);
        return;
      }

      const result = await codeAPI.executeCode(code, language, input);

      if (result.success) {
        setOutput(result.data?.output || "No output");
        // Notify parent of state
        onStateChange?.({ code, language, error: "", problems });
      } else {
        const errorMsg = result.error || "Execution failed";
        setOutput(errorMsg);
        // Notify parent of error
        onStateChange?.({ code, language, error: errorMsg, problems });
      }
    } catch (error: unknown) {
      const executionError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMsg =
        executionError?.response?.data?.message ||
          "Error: Failed to execute code. Please try again.";
      setOutput(errorMsg);
      // Notify parent of error
      onStateChange?.({ code, language, error: errorMsg, problems });
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (newLanguage: string) => {
    handleLanguageChange(newLanguage, setLanguage, setCode);
    setOutput("");
    setProblems([]);
    clearCodeFromStorage(); // Clear since we're intentionally changing language
  };

  // Handle Monaco Editor mount
  const handleEditorDidMount = (editor: monacoType.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Validate on initial mount
    validateCode(code, language, monaco, editor);
  };

  // Validate code and update markers
  const validateCode = (code: string, lang: string, monaco: Monaco, editor: monacoType.editor.IStandaloneCodeEditor) => {
    const model = editor.getModel();
    if (!model) return;

    const markers: monacoType.editor.IMarkerData[] = [];
    const newProblems: typeof problems = [];

    try {
      let errors: ValidationError[] = [];
      
      if (lang === 'python') {
        errors = checkPythonSyntax(code);
      } else if (lang === 'javascript') {
        errors = checkJavaScriptSyntax(code);
      } else if (lang === 'cpp') {
        errors = checkCppSyntax(code);
      }

      errors.forEach(error => {
        markers.push({
          severity: monaco.MarkerSeverity.Error,
          message: error.message,
          startLineNumber: error.line,
          startColumn: error.column,
          endLineNumber: error.line,
          endColumn: error.column + 10,
        });
        newProblems.push({
          severity: 'error',
          message: error.message,
          line: error.line,
          column: error.column,
        });
      });
    } catch (e) {
      console.error('Validation error:', e);
    }

    monaco.editor.setModelMarkers(model, 'owner', markers);
    setProblems(newProblems);
  };

  // Re-validate when code or language changes
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const timeoutId = setTimeout(() => {
        validateCode(code, language, monacoRef.current!, editorRef.current!);
      }, 500); // Debounce validation
      
      return () => clearTimeout(timeoutId);
    }
  }, [code, language]);

  const handleImportCode = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js,.py,.cpp,.c,.h,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setCode(content);
          
          // Auto-select language based on file extension
          const fileName = file.name.toLowerCase();
          if (fileName.endsWith('.js')) {
            setLanguage('javascript');
          } else if (fileName.endsWith('.py')) {
            setLanguage('python');
          } else if (fileName.endsWith('.cpp') || fileName.endsWith('.c') || fileName.endsWith('.h')) {
            setLanguage('cpp');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExportCode = () => {
    setExportFileName("code");
    setShowExportModal(true);
  };

  const confirmExport = () => {
    const fileExtensions: { [key: string]: string } = {
      javascript: 'js',
      python: 'py',
      cpp: 'cpp'
    };
    const extension = fileExtensions[language] || 'txt';
    
    if (!exportFileName.trim()) return;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportFileName.trim()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  return (
    <div className="flex flex-3 flex-col h-screen">
      <div className="flex flex-col flex-2 bg-gray-50 overflow-hidden" style={{ minHeight: 0 }}>
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
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setShowSnippetsPanel(!showSnippetsPanel)}
                  title="My Saved Code"
                  className="px-3 py-1 rounded bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 flex items-center gap-1 relative"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                  Saved ({snippets.length})
                </button>
                <button
                  onClick={() => setShowSaveModal(true)}
                  title="Save Code"
                  className="px-3 py-1 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save
                </button>
              </>
            )}
            <button
              onClick={handleImportCode}
              title="Import Code"
              className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Import
            </button>
            <button
              onClick={handleExportCode}
              title="Export Code"
              className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Export
            </button>
            <button
              onClick={runCode}
              disabled={loading}
              className="px-3 py-1 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Running...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Run
                </>
              )}
            </button>
            <button
              onClick={() => {
                setCode(getDefaultCodeForLanguage(language));
                clearCodeFromStorage(); // Clear localStorage when intentionally resetting
                showToast("Code reset to default template", "info");
              }}
              title="Reset Code"
              className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </div>
        <div style={{ flexGrow: 1, minHeight: 0 }}>
          <Editor
            height="100%"
            language={language === "cpp" ? "cpp" : language}
            value={code}
            onChange={(value) => setCode(value || "")}
            onMount={handleEditorDidMount}
            options={{ 
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              automaticLayout: true,
            }}
          />
        </div>
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
            <button
              onClick={() => setActiveTab("problems")}
              className={`px-4 py-2 text-sm flex items-center gap-1 ${
                activeTab === "problems"
                  ? "text-gray-900 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Problems
              {problems.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {problems.length}
                </span>
              )}
            </button>
          </div>
          {activeTab === "output" && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (output) {
                    navigator.clipboard.writeText(output);
                    showToast("Output copied to clipboard!", "success");
                  } else {
                    showToast("No output to copy", "warning");
                  }
                }}
                title="Copy Output"
                className="text-gray-500 hover:text-gray-800 p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setOutput("");
                  showToast("Output cleared", "info");
                }}
                title="Clear Output"
                className="text-gray-500 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
        {/* Tab Content */}
        <div className="flex-1 p-3 overflow-auto bg-white max-h-[300px]">
          {activeTab === "output" ? (
            <pre className="text-sm whitespace-pre-wrap font-mono text-gray-800">
              {output || "Your code's output will be displayed here."}
              <div ref={outputEndRef} />
            </pre>
          ) : activeTab === "input" ? (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full p-2 rounded bg-white text-gray-900 border border-gray-300 resize-none text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Provide all inputs here (one per line)..."
            />
          ) : (
            <div className="h-full">
              {/* Header Section */}
              <div className="mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-gray-700" />
                    <h3 className="text-base font-semibold text-gray-900">Problems</h3>
                  </div>
                  <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    problems.length === 0 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {problems.length === 0 
                      ? "No issues" 
                      : `${problems.length} ${problems.length === 1 ? 'issue' : 'issues'}`}
                  </div>
                </div>
              </div>

              {/* Problems List */}
              {problems.length > 0 ? (
                <div className="space-y-2">
                  {problems.map((problem, index) => (
                    <div
                      key={index}
                      className={`group flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${
                        problem.severity === 'error'
                          ? 'bg-red-50 border-red-200 hover:bg-red-100'
                          : problem.severity === 'warning'
                          ? 'bg-amber-50 border-amber-200 hover:bg-amber-100'
                          : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                      }`}
                      onClick={() => {
                        if (editorRef.current) {
                          editorRef.current.revealLineInCenter(problem.line);
                          editorRef.current.setPosition({ lineNumber: problem.line, column: problem.column });
                          editorRef.current.focus();
                        }
                      }}
                    >
                      {/* Icon */}
                      <div className={`flex-shrink-0 mt-0.5 ${
                        problem.severity === 'error'
                          ? 'text-red-600'
                          : problem.severity === 'warning'
                          ? 'text-amber-600'
                          : 'text-blue-600'
                      }`}>
                        {problem.severity === 'error' ? (
                          <XCircle className="w-5 h-5" />
                        ) : problem.severity === 'warning' ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <Info className="w-5 h-5" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900 leading-snug">
                            {problem.message}
                          </p>
                          <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded ${
                            problem.severity === 'error'
                              ? 'bg-red-200 text-red-800'
                              : problem.severity === 'warning'
                              ? 'bg-amber-200 text-amber-800'
                              : 'bg-blue-200 text-blue-800'
                          }`}>
                            {problem.severity.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-gray-600 font-mono">
                            Ln {problem.line}, Col {problem.column}
                          </span>
                          <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                            Click to jump →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-green-100 rounded-full p-4 mb-4">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h4 className="text-base font-semibold text-gray-900 mb-1">
                    No Problems Found
                  </h4>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Your code looks good! No syntax errors detected.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Code Snippet</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveSnippet()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter snippet title"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                Language: {language.toUpperCase()}
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setSaveTitle("");
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSnippet}
                disabled={!saveTitle.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Snippets Panel */}
      {showSnippetsPanel && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">My Saved Code</h3>
              <button
                onClick={() => setShowSnippetsPanel(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loadingSnippets ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                </div>
              ) : snippets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium">No saved code yet</p>
                  <p className="text-sm mt-1">Save your code snippets to access them later</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {snippets.map((snippet) => (
                    <div
                      key={snippet._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{snippet.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                            {snippet.language.toUpperCase()}
                          </span>
                          <span>{new Date(snippet.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleLoadSnippet(snippet)}
                          className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => confirmDeleteSnippet(snippet._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.show}
        title="Delete Code Snippet"
        message="Are you sure you want to delete this code snippet? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        onConfirm={handleDeleteSnippet}
        onCancel={() => setDeleteConfirm({ show: false, snippetId: null })}
      />

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Code</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filename (without extension)
              </label>
              <input
                type="text"
                value={exportFileName}
                onChange={(e) => setExportFileName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirmExport()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter filename"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                File will be saved as: {exportFileName || 'code'}.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'cpp'}
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmExport}
                disabled={!exportFileName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
