/**
 * Code Validation Utilities
 * Real-time syntax checking for Python, JavaScript, and C++
 */

export interface ValidationError {
  message: string;
  line: number;
  column: number;
}

/**
 * Python syntax checker
 * Detects common syntax errors in Python code
 */
export const checkPythonSyntax = (code: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) return;
    
    // Check for semicolons (not pythonic)
    if (line.includes(';') && !line.trim().startsWith('#')) {
      errors.push({ 
        message: 'Unexpected ";" - Python does not require semicolons at end of statements', 
        line: lineNum, 
        column: line.indexOf(';') + 1 
      });
    }
    
    // Check for common syntax errors
    if (trimmed.match(/^(if|elif|while|for|def|class|with|try|except|finally|else)\s+/) && !trimmed.endsWith(':')) {
      errors.push({ message: `SyntaxError: expected ":" at end of statement`, line: lineNum, column: 1 });
    }
    
    // Check for undefined variables (basic check for obvious typos like sssss)
    const assignMatch = line.match(/(\w+)\s*=\s*([a-z]{4,})\s*[;,]?/);
    if (assignMatch && !line.includes('(') && !line.includes('"') && !line.includes("'") && 
        !line.includes('[') && !line.includes('{') && assignMatch[2].match(/^[a-z]+$/)) {
      const varName = assignMatch[2];
      // Check if it looks like a typo (all lowercase, no common keywords)
      if (!['true', 'false', 'none', 'self', 'list', 'dict', 'set', 'tuple', 'str', 'int', 'float', 'bool'].includes(varName)) {
        errors.push({ 
          message: `NameError: name '${varName}' is not defined (possible typo?)`, 
          line: lineNum, 
          column: line.indexOf(varName) + 1 
        });
      }
    }
    
    // Check for unmatched parentheses/brackets
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push({ message: 'SyntaxError: unmatched parentheses', line: lineNum, column: 1 });
    }
    
    const openBrackets = (line.match(/\[/g) || []).length;
    const closeBrackets = (line.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push({ message: 'SyntaxError: unmatched brackets', line: lineNum, column: 1 });
    }
    
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push({ message: 'SyntaxError: unmatched braces', line: lineNum, column: 1 });
    }
    
    // Check for incorrect string quotes
    const singleQuotes = (line.match(/(?<!\\)'/g) || []).length;
    const doubleQuotes = (line.match(/(?<!\\)"/g) || []).length;
    if (singleQuotes % 2 !== 0) {
      errors.push({ message: "SyntaxError: unterminated string literal (single quote)", line: lineNum, column: 1 });
    }
    if (doubleQuotes % 2 !== 0) {
      errors.push({ message: "SyntaxError: unterminated string literal (double quote)", line: lineNum, column: 1 });
    }
  });
  
  return errors;
};

/**
 * JavaScript syntax checker
 * Detects common syntax errors in JavaScript code
 */
export const checkJavaScriptSyntax = (code: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  try {
    // Try to parse with Function constructor (basic check)
    new Function(code);
  } catch (e) {
    if (e instanceof SyntaxError) {
      // Parse error message to get line number
      const message = e.message;
      const lines = code.split('\n');
      
      // Try to find approximate error location
      let errorLine = 1;
      
      // Chrome/V8 error format
      const v8Match = message.match(/at position (\d+)/);
      if (v8Match) {
        const position = parseInt(v8Match[1]);
        let currentPos = 0;
        for (let i = 0; i < lines.length; i++) {
          currentPos += lines[i].length + 1;
          if (currentPos >= position) {
            errorLine = i + 1;
            break;
          }
        }
      }
      
      errors.push({ message: `SyntaxError: ${message}`, line: errorLine, column: 1 });
    }
  }
  
  // Additional checks
  const lines = code.split('\n');
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();
    
    if (!trimmed || trimmed.startsWith('//')) return;
    
    // Check for unmatched parentheses
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push({ message: 'SyntaxError: unmatched parentheses', line: lineNum, column: 1 });
    }
    
    // Check for unmatched brackets
    const openBrackets = (line.match(/\[/g) || []).length;
    const closeBrackets = (line.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push({ message: 'SyntaxError: unmatched brackets', line: lineNum, column: 1 });
    }
  });
  
  return errors;
};

/**
 * C++ syntax checker
 * Detects common syntax errors in C++ code
 */
export const checkCppSyntax = (code: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();
    
    // Skip empty lines, comments, and preprocessor directives
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) return;
    
    // Check for missing semicolons (basic check)
    if (trimmed && 
        !trimmed.startsWith('//') && 
        !trimmed.startsWith('#') &&
        !trimmed.endsWith(';') && 
        !trimmed.endsWith('{') && 
        !trimmed.endsWith('}') &&
        !trimmed.endsWith(',') &&
        !trimmed.endsWith(':') &&
        !trimmed.match(/^(if|else|for|while|do|switch|case|default|public|private|protected|class|struct|namespace|template|using)\b/) &&
        !trimmed.match(/^\}/) &&
        !trimmed.match(/^(public|private|protected):$/) &&
        trimmed.length > 0) {
      errors.push({ message: 'Expected ";" at end of statement', line: lineNum, column: trimmed.length });
    }
    
    // Check for unmatched braces
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    if (openBraces !== closeBraces && (openBraces > 0 || closeBraces > 0)) {
      errors.push({ message: 'Unmatched braces', line: lineNum, column: 1 });
    }
    
    // Check for unmatched parentheses
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push({ message: 'Unmatched parentheses', line: lineNum, column: 1 });
    }
    
    // Check for unmatched brackets
    const openBrackets = (line.match(/\[/g) || []).length;
    const closeBrackets = (line.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push({ message: 'Unmatched brackets', line: lineNum, column: 1 });
    }
  });
  
  return errors;
};
