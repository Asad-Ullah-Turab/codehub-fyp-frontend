// Code execution functions
import { codeAPI } from '../../services/api';

// Types
interface CodeExecutionResult {
  success: boolean;
  data?: {
    output?: string;
  };
  error?: string;
}

interface LanguageOption {
  id: string;
  name: string;
  defaultCode: string;
}

// Language configurations
export const languageOptions: LanguageOption[] = [
  {
    id: "javascript",
    name: "JavaScript",
    defaultCode: `// JavaScript with Input Example
process.stdin.on('data', (data) => {
    const name = data.toString().trim();
    console.log('Hello, ' + name + '!');
    process.exit(0);
});

// Leave input empty to be prompted, or provide input above`,
  },
  {
    id: "python",
    name: "Python",
    defaultCode: `# Python with Input Example
name = input("What's your name? ")
age = input("What's your age? ")
print(f"Hello {name}, you are {age} years old!")

# Leave input empty to be prompted interactively!`,
  },
  {
    id: "cpp",
    name: "C++",
    defaultCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string name;
    int age;
    
    cout << "What's your name? ";
    cin >> name;
    
    cout << "What's your age? ";
    cin >> age;
    
    cout << "Hello " << name << ", you are " << age << " years old!" << endl;
    
    return 0;
}

// Leave input empty to be prompted interactively!`,
  },
];

// Code execution handler
export const handleCodeExecution = async (
  code: string,
  language: string,
  input: string,
  setOutput: (output: string) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  setOutput("Running...");

  try {
    // Validate inputs
    if (!code.trim()) {
      setOutput("Error: No code to execute");
      setLoading(false);
      return;
    }

    if (!language) {
      setOutput("Error: No language selected");
      setLoading(false);
      return;
    }

    const result: CodeExecutionResult = await codeAPI.executeCode(code, language, input);
    
    if (result.success) {
      setOutput(result.data?.output || "No output");
    } else {
      setOutput(result.error || "Execution failed");
    }
  } catch (error: unknown) {
    const executionError = error as { response?: { data?: { message?: string } } };
    setOutput(
      executionError?.response?.data?.message || 
      "Error: Failed to execute code. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

// Language change handler
export const handleLanguageChange = (
  newLanguage: string,
  setLanguage: (language: string) => void,
  setCode: (code: string) => void
) => {
  setLanguage(newLanguage);
  
  // Set default code for the selected language
  const selectedLanguage = languageOptions.find(lang => lang.id === newLanguage);
  if (selectedLanguage) {
    setCode(selectedLanguage.defaultCode);
  }
};

// Get language display name
export const getLanguageDisplayName = (languageId: string): string => {
  const language = languageOptions.find(lang => lang.id === languageId);
  return language?.name || languageId;
};

// Get default code for language
export const getDefaultCodeForLanguage = (languageId: string): string => {
  const language = languageOptions.find(lang => lang.id === languageId);
  return language?.defaultCode || "// write your code here...";
};

// Validate code input
export const validateCode = (code: string, language: string): string | null => {
  if (!code.trim()) {
    return "Code cannot be empty";
  }

  if (!language) {
    return "Please select a programming language";
  }

  // Language-specific basic validation
  switch (language) {
    case 'javascript':
      // Basic JavaScript validation (can be expanded)
      break;
    case 'python':
      // Basic Python validation (can be expanded)
      break;
    case 'cpp':
      // Basic C++ validation (can be expanded)
      if (!code.includes('#include')) {
        return "Warning: C++ code should include necessary headers";
      }
      if (!code.includes('main')) {
        return "Warning: C++ code should have a main function";
      }
      break;
    default:
      return "Unsupported programming language";
  }

  return null;
};

// Format code output
export const formatCodeOutput = (output: string): string => {
  if (!output) return "No output";
  
  // Remove excessive newlines
  return output.replace(/\n{3,}/g, '\n\n').trim();
};

// Check if language is supported
export const isLanguageSupported = (languageId: string): boolean => {
  return languageOptions.some(lang => lang.id === languageId);
};