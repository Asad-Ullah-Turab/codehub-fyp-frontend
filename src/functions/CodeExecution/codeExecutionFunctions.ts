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
    defaultCode: `// Fibonacci sequence
function fibonacci(n) {
    const seq = [0, 1];
    for (let i = 2; i < n; i++) {
        seq.push(seq[i - 1] + seq[i - 2]);
    }
    return seq.slice(0, n);
}

console.log("Fibonacci (10 terms):", fibonacci(10).join(", "));

// Filter and map example
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = numbers
    .filter(n => n % 2 === 0)
    .map(n => n * n);

console.log("Even squares:", result.join(", "));

// Object and array
const students = [
    { name: "Alice", grade: 92 },
    { name: "Bob", grade: 85 },
    { name: "Carol", grade: 98 },
];

const top = students.sort((a, b) => b.grade - a.grade)[0];
console.log(\`Top student: \${top.name} with \${top.grade}\`);`,
  },
  {
    id: "python",
    name: "Python",
    defaultCode: `name = input("Enter your name: ")
age = int(input("Enter your age: "))
city = input("Enter your city: ")

print(f"Hello, {name}!")
print(f"You are {age} years old.")
print(f"You live in {city}.")
print(f"In 10 years, you will be {age + 10}.")`,
  },
  {
    id: "cpp",
    name: "C++",
    defaultCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string name, city;
    int age;

    cout << "Enter your name: ";
    getline(cin, name);

    cout << "Enter your age: ";
    cin >> age;
    cin.ignore();

    cout << "Enter your city: ";
    getline(cin, city);

    cout << "Hello, " << name << "!" << endl;
    cout << "You are " << age << " years old." << endl;
    cout << "You live in " << city << "." << endl;
    cout << "In 10 years, you will be " << age + 10 << "." << endl;

    return 0;
}`,
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