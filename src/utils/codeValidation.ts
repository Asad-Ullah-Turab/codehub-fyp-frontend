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
  
  let inMultilineString = false;
  let multilineStringChar = '';
  
  // Track defined variables, functions, and imports
  const definedVariables = new Set<string>([
    'print', 'input', 'len', 'range', 'str', 'int', 'float', 'bool', 'list', 'dict', 'set', 'tuple',
    'True', 'False', 'None', 'type', 'isinstance', 'sum', 'max', 'min', 'abs', 'round', 'sorted',
    'open', 'file', 'zip', 'map', 'filter', 'enumerate', 'any', 'all'
  ]);
  const definedFunctions = new Set<string>();
  
  // First pass: collect defined variables and functions
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith('#')) return;
    
    // Track function definitions
    const funcMatch = trimmed.match(/^def\s+(\w+)/);
    if (funcMatch) {
      definedFunctions.add(funcMatch[1]);
      definedVariables.add(funcMatch[1]);
      
      // Extract parameters
      const paramMatch = trimmed.match(/def\s+\w+\s*\(([^)]*)\)/);
      if (paramMatch && paramMatch[1]) {
        const params = paramMatch[1].split(',').map(p => p.trim().split('=')[0].trim());
        params.forEach(p => {
          if (p && p !== '*' && p !== '**') {
            definedVariables.add(p.replace(/^\*+/, ''));
          }
        });
      }
    }
    
    // Track variable assignments
    const assignMatch = trimmed.match(/^(\w+)\s*=/);
    if (assignMatch) {
      definedVariables.add(assignMatch[1]);
    }
    
    // Track for loop variables
    const forMatch = trimmed.match(/^for\s+(\w+)\s+in/);
    if (forMatch) {
      definedVariables.add(forMatch[1]);
    }
    
    // Track imports
    const importMatch = trimmed.match(/^(?:from\s+\w+\s+)?import\s+([\w,\s]+)/);
    if (importMatch) {
      const imports = importMatch[1].split(',').map(i => i.trim().split(' as ')[0].trim());
      imports.forEach(imp => definedVariables.add(imp));
    }
  });
  
  // Second pass: validate code
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();
    
    // Check for multiline strings
    if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
      const char = trimmed.substring(0, 3);
      if (inMultilineString && char === multilineStringChar) {
        inMultilineString = false;
      } else if (!inMultilineString) {
        inMultilineString = true;
        multilineStringChar = char;
      }
    }
    
    // Skip empty lines, comments, and lines inside multiline strings
    if (!trimmed || trimmed.startsWith('#') || inMultilineString) return;
    
    // Check for standalone undefined variables (like "addas")
    if (trimmed.match(/^[a-zA-Z_]\w*$/) && !definedVariables.has(trimmed)) {
      errors.push({
        message: `NameError: name '${trimmed}' is not defined - standalone statement has no effect`,
        line: lineNum,
        column: 1
      });
    }
    
    // Check for undefined variables in expressions
    // Look for variable usage (not in strings, not assignments)
    if (!trimmed.startsWith('def ') && 
        !trimmed.startsWith('class ') && 
        !trimmed.startsWith('import ') &&
        !trimmed.startsWith('from ')) {
      
      // Remove all string literals from the line before checking variables
      let lineWithoutStrings = line;
      // Remove triple-quoted strings
      lineWithoutStrings = lineWithoutStrings.replace(/"""[\s\S]*?"""/g, '');
      lineWithoutStrings = lineWithoutStrings.replace(/'''[\s\S]*?'''/g, '');
      // Remove double-quoted strings
      lineWithoutStrings = lineWithoutStrings.replace(/"(?:[^"\\]|\\.)*"/g, '');
      // Remove single-quoted strings
      lineWithoutStrings = lineWithoutStrings.replace(/'(?:[^'\\]|\\.)*'/g, '');
      
      // Extract potential variable names from the line (without strings)
      const words = lineWithoutStrings.match(/\b[a-zA-Z_]\w*\b/g) || [];
      words.forEach(word => {
        // Skip keywords and already defined
        const keywords = ['if', 'elif', 'else', 'for', 'while', 'def', 'class', 'return', 
                         'import', 'from', 'as', 'try', 'except', 'finally', 'with', 
                         'lambda', 'yield', 'pass', 'break', 'continue', 'and', 'or', 
                         'not', 'in', 'is', 'assert', 'del', 'global', 'nonlocal', 'raise'];
        
        if (keywords.includes(word) || definedVariables.has(word)) return;
        
        // Check if it's being assigned (left side of =)
        if (trimmed.match(new RegExp(`^${word}\\s*=`)) || 
            trimmed.match(new RegExp(`^for\\s+${word}\\s+in`))) {
          definedVariables.add(word);
          return;
        }
        
        // Check if it looks like a typo (undefined usage)
        if (!trimmed.startsWith(word + ' =') && !trimmed.startsWith('for ' + word)) {
          errors.push({
            message: `NameError: name '${word}' is not defined (possible typo?)`,
            line: lineNum,
            column: line.indexOf(word) + 1
          });
        }
      });
    }
    
    // Check for semicolons (not pythonic)
    if (line.includes(';') && !trimmed.startsWith('#')) {
      errors.push({ 
        message: 'Unexpected ";" - Python does not use semicolons to end statements', 
        line: lineNum, 
        column: line.indexOf(';') + 1 
      });
    }
    
    // Check for missing colons at end of control structures
    if (trimmed.match(/^(if|elif|while|for|def|class|with|try|except|finally|else)\s+/) && !trimmed.endsWith(':')) {
      errors.push({ 
        message: `SyntaxError: expected ":" at end of ${trimmed.split(/\s+/)[0]} statement`, 
        line: lineNum, 
        column: trimmed.length 
      });
    }
    
    // Check for incorrect else/elif without colon
    if (trimmed.match(/^(else|elif|except|finally)\s*[^:]/) && !trimmed.endsWith(':')) {
      errors.push({ 
        message: 'SyntaxError: expected ":" after keyword', 
        line: lineNum, 
        column: 1 
      });
    }
    
    // Check for invalid function/class names
    if (trimmed.match(/^def\s+([^a-z_]|[0-9])/)) {
      errors.push({ 
        message: 'SyntaxError: invalid function name (must start with letter or underscore)', 
        line: lineNum, 
        column: 5 
      });
    }
    
    if (trimmed.match(/^class\s+([^A-Z])/)) {
      errors.push({ 
        message: 'Convention: class names should start with uppercase letter', 
        line: lineNum, 
        column: 7 
      });
    }
    
    // Check for unmatched parentheses, brackets, braces
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push({ 
        message: `SyntaxError: unmatched parentheses (${openParens} open, ${closeParens} close)`, 
        line: lineNum, 
        column: 1 
      });
    }
    
    const openBrackets = (line.match(/\[/g) || []).length;
    const closeBrackets = (line.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push({ 
        message: `SyntaxError: unmatched brackets (${openBrackets} open, ${closeBrackets} close)`, 
        line: lineNum, 
        column: 1 
      });
    }
    
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push({ 
        message: `SyntaxError: unmatched braces (${openBraces} open, ${closeBraces} close)`, 
        line: lineNum, 
        column: 1 
      });
    }
    
    // Check for unterminated string literals
    const singleQuotes = (line.match(/(?<!\\)'/g) || []).length;
    const doubleQuotes = (line.match(/(?<!\\)"/g) || []).length;
    if (singleQuotes % 2 !== 0 && !line.includes('"""') && !line.includes("'''")) {
      errors.push({ 
        message: "SyntaxError: unterminated string literal (single quote)", 
        line: lineNum, 
        column: line.indexOf("'") + 1 
      });
    }
    if (doubleQuotes % 2 !== 0 && !line.includes('"""') && !line.includes("'''")) {
      errors.push({ 
        message: "SyntaxError: unterminated string literal (double quote)", 
        line: lineNum, 
        column: line.indexOf('"') + 1 
      });
    }
    
    // Check for common mistakes
    if (trimmed.includes('else if')) {
      errors.push({ 
        message: 'SyntaxError: use "elif" instead of "else if" in Python', 
        line: lineNum, 
        column: trimmed.indexOf('else if') + 1 
      });
    }
    
    if (trimmed.match(/print\s+[^(]/)) {
      errors.push({ 
        message: 'SyntaxError: print is a function in Python 3, use print(...)', 
        line: lineNum, 
        column: trimmed.indexOf('print') + 1 
      });
    }
    
    // Check for invalid comparisons
    if (trimmed.match(/\s(=)\s/) && !trimmed.includes('==') && trimmed.includes('if ')) {
      errors.push({ 
        message: 'Warning: use "==" for comparison, not "=" (assignment)', 
        line: lineNum, 
        column: line.indexOf('=') + 1 
      });
    }
    
    // Check for missing commas in lists/tuples
    if (trimmed.match(/\[\s*\w+\s+\w+/) && !trimmed.includes('"') && !trimmed.includes("'")) {
      errors.push({ 
        message: 'SyntaxError: missing comma between list elements?', 
        line: lineNum, 
        column: 1 
      });
    }
    
    // Check for pass/return/break/continue not alone
    if (trimmed.match(/^(pass|break|continue)\s+\w/)) {
      errors.push({ 
        message: `SyntaxError: ${trimmed.split(/\s+/)[0]} is a standalone statement`, 
        line: lineNum, 
        column: 1 
      });
    }
    
    // Check for invalid indentation after colon
    if (index > 0 && lines[index - 1].trim().endsWith(':')) {
      const prevIndent = lines[index - 1].length - lines[index - 1].trimStart().length;
      const currIndent = line.length - line.trimStart().length;
      if (trimmed && currIndent <= prevIndent) {
        errors.push({ 
          message: 'IndentationError: expected an indented block', 
          line: lineNum, 
          column: 1 
        });
      }
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
      const message = e.message;
      const lines = code.split('\n');
      
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
  
  // Additional line-by-line checks
  const lines = code.split('\n');
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();
    
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) return;
    
    // Check for missing var/let/const
    if (trimmed.match(/^[a-zA-Z_$][\w$]*\s*=\s*/) && 
        !trimmed.startsWith('var ') && 
        !trimmed.startsWith('let ') && 
        !trimmed.startsWith('const ') &&
        index > 0) {
      const varName = trimmed.split('=')[0].trim();
      // Check if it's not a property assignment
      if (!varName.includes('.') && !trimmed.includes('this.')) {
        errors.push({ 
          message: `Warning: variable '${varName}' used without declaration (use var/let/const)`, 
          line: lineNum, 
          column: 1 
        });
      }
    }
    
    // Check for missing semicolons in certain contexts
    if (trimmed && 
        !trimmed.endsWith(';') && 
        !trimmed.endsWith('{') && 
        !trimmed.endsWith('}') &&
        !trimmed.endsWith(',') &&
        !trimmed.startsWith('if') &&
        !trimmed.startsWith('for') &&
        !trimmed.startsWith('while') &&
        !trimmed.startsWith('function') &&
        !trimmed.startsWith('class') &&
        !trimmed.startsWith('else') &&
        !trimmed.startsWith('//') &&
        !trimmed.startsWith('/*') &&
        !trimmed.startsWith('*') &&
        trimmed.includes('=')) {
      // Only warn for statements that should have semicolons
      if (index < lines.length - 1 && lines[index + 1].trim()) {
        errors.push({ 
          message: 'Warning: missing semicolon (recommended)', 
          line: lineNum, 
          column: trimmed.length 
        });
      }
    }
    
    // Check for invalid function declarations
    if (trimmed.match(/^function\s+[0-9]/) || trimmed.match(/^function\s+[^a-zA-Z_$]/)) {
      errors.push({ 
        message: 'SyntaxError: invalid function name', 
        line: lineNum, 
        column: 10 
      });
    }
    
    // Check for arrow function syntax errors
    if (trimmed.includes('=>') && !trimmed.includes('(')) {
      if (trimmed.match(/\w+\s*=\s*\w+\s*=>/)) {
        errors.push({ 
          message: 'SyntaxError: arrow function parameters must be in parentheses', 
          line: lineNum, 
          column: trimmed.indexOf('=>') 
        });
      }
    }
    
    // Check for incorrect comparison operators
    if (trimmed.match(/[^=!<>](=)[^=]/) && 
        (trimmed.includes('if') || trimmed.includes('while'))) {
      errors.push({ 
        message: 'Warning: use "==" or "===" for comparison, not "=" (assignment)', 
        line: lineNum, 
        column: line.indexOf('=') + 1 
      });
    }
    
    // Check for unmatched parentheses
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push({ 
        message: `SyntaxError: unmatched parentheses (${openParens} open, ${closeParens} close)`, 
        line: lineNum, 
        column: 1 
      });
    }
    
    // Check for unmatched brackets
    const openBrackets = (line.match(/\[/g) || []).length;
    const closeBrackets = (line.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push({ 
        message: `SyntaxError: unmatched brackets (${openBrackets} open, ${closeBrackets} close)`, 
        line: lineNum, 
        column: 1 
      });
    }
    
    // Check for unmatched braces
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    if (openBraces !== closeBraces && (openBraces > 0 || closeBraces > 0)) {
      errors.push({ 
        message: `SyntaxError: unmatched braces (${openBraces} open, ${closeBraces} close)`, 
        line: lineNum, 
        column: 1 
      });
    }
    
    // Check for invalid console.log syntax
    if (trimmed.includes('console.log') && !trimmed.includes('console.log(')) {
      errors.push({ 
        message: 'SyntaxError: console.log requires parentheses', 
        line: lineNum, 
        column: trimmed.indexOf('console.log') + 1 
      });
    }
    
    // Check for unterminated strings
    const singleQuotes = (line.match(/(?<!\\)'/g) || []).length;
    const doubleQuotes = (line.match(/(?<!\\)"/g) || []).length;
    const backticks = (line.match(/(?<!\\)`/g) || []).length;
    
    if (singleQuotes % 2 !== 0) {
      errors.push({ 
        message: "SyntaxError: unterminated string literal (single quote)", 
        line: lineNum, 
        column: line.indexOf("'") + 1 
      });
    }
    if (doubleQuotes % 2 !== 0) {
      errors.push({ 
        message: "SyntaxError: unterminated string literal (double quote)", 
        line: lineNum, 
        column: line.indexOf('"') + 1 
      });
    }
    if (backticks % 2 !== 0) {
      errors.push({ 
        message: "SyntaxError: unterminated template literal", 
        line: lineNum, 
        column: line.indexOf('`') + 1 
      });
    }
    
    // Check for missing commas in object literals
    if (trimmed.match(/{\s*\w+:\s*\w+\s+\w+:/)) {
      errors.push({ 
        message: 'SyntaxError: missing comma in object literal', 
        line: lineNum, 
        column: 1 
      });
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
  
  let hasInclude = false;
  let hasMain = false;
  let braceBalance = 0;
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();
    
    // Skip empty lines, comments
    if (!trimmed || trimmed.startsWith('//')) return;
    
    // Check for include statements
    if (trimmed.startsWith('#include')) {
      hasInclude = true;
      
      // Check for proper include format
      if (!trimmed.match(/#include\s*[<"][\w./]+[>"]/)) {
        errors.push({ 
          message: 'SyntaxError: invalid #include format (use #include <file> or #include "file")', 
          line: lineNum, 
          column: 1 
        });
      }
    }
    
    // Check for main function
    if (trimmed.includes('int main') || trimmed.includes('void main')) {
      hasMain = true;
      
      // Check if main has proper format
      if (!trimmed.match(/int\s+main\s*\(/)) {
        errors.push({ 
          message: 'Warning: main should return int', 
          line: lineNum, 
          column: 1 
        });
      }
    }
    
    // Track brace balance
    braceBalance += (line.match(/{/g) || []).length;
    braceBalance -= (line.match(/}/g) || []).length;
    
    // Check for missing semicolons
    if (trimmed && 
        !trimmed.startsWith('//') && 
        !trimmed.startsWith('#') &&
        !trimmed.startsWith('/*') &&
        !trimmed.startsWith('*') &&
        !trimmed.endsWith(';') && 
        !trimmed.endsWith('{') && 
        !trimmed.endsWith('}') &&
        !trimmed.endsWith(',') &&
        !trimmed.endsWith(':') &&
        !trimmed.endsWith('\\') &&
        !trimmed.match(/^(if|else|for|while|do|switch|case|default|public|private|protected|class|struct|namespace|template|using|enum)\b/) &&
        !trimmed.match(/^\}/) &&
        !trimmed.match(/^(public|private|protected):$/) &&
        !trimmed.includes('<<') && // cout statements might span lines
        trimmed.length > 0) {
      
      // Check if it looks like a statement that needs semicolon
      if (trimmed.match(/=/) || 
          trimmed.match(/^(int|float|double|char|bool|string|void|auto|long|short)\s/) ||
          trimmed.match(/^return\s/) ||
          trimmed.includes('++') ||
          trimmed.includes('--')) {
        errors.push({ 
          message: 'SyntaxError: expected ";" at end of statement', 
          line: lineNum, 
          column: trimmed.length 
        });
      }
    }
    
    // Check for unmatched braces
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    if (openBraces !== closeBraces && (openBraces > 0 || closeBraces > 0)) {
      errors.push({ 
        message: `SyntaxError: unmatched braces on this line (${openBraces} open, ${closeBraces} close)`, 
        line: lineNum, 
        column: 1 
      });
    }
    
    // Check for unmatched parentheses
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push({ 
        message: `SyntaxError: unmatched parentheses (${openParens} open, ${closeParens} close)`, 
        line: lineNum, 
        column: 1 
      });
    }
    
    // Check for unmatched brackets
    const openBrackets = (line.match(/\[/g) || []).length;
    const closeBrackets = (line.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push({ 
        message: `SyntaxError: unmatched brackets (${openBrackets} open, ${closeBrackets} close)`, 
        line: lineNum, 
        column: 1 
      });
    }
    
    // Check for missing namespace std
    if ((trimmed.includes('cout') || trimmed.includes('cin') || trimmed.includes('endl')) && 
        !code.includes('using namespace std') && 
        !trimmed.includes('std::')) {
      errors.push({ 
        message: 'Error: cout/cin/endl requires "using namespace std;" or std:: prefix', 
        line: lineNum, 
        column: 1 
      });
    }
    
    // Check for invalid variable declarations
    if (trimmed.match(/^(int|float|double|char|bool|string)\s+[0-9]/)) {
      errors.push({ 
        message: 'SyntaxError: variable names cannot start with numbers', 
        line: lineNum, 
        column: 1 
      });
    }
    
    // Check for assignment in if condition (common mistake)
    if (trimmed.match(/if\s*\([^)]*=[^=][^)]*\)/)) {
      errors.push({ 
        message: 'Warning: use "==" for comparison, not "=" (assignment) in if condition', 
        line: lineNum, 
        column: trimmed.indexOf('if') + 1 
      });
    }
    
    // Check for incorrect pointer/reference syntax
    if (trimmed.match(/[*&]\s+[a-zA-Z]/)) {
      errors.push({ 
        message: 'Warning: pointer/reference symbol should be attached to type (int* ptr, not int * ptr)', 
        line: lineNum, 
        column: trimmed.indexOf('*') + 1 
      });
    }
    
    // Check for missing return type in function
    if (trimmed.match(/^\w+\s+\w+\s*\(.*\)\s*{?$/) && 
        !trimmed.match(/^(if|for|while|switch)/) &&
        !trimmed.startsWith('int') &&
        !trimmed.startsWith('void') &&
        !trimmed.startsWith('float') &&
        !trimmed.startsWith('double') &&
        !trimmed.startsWith('char') &&
        !trimmed.startsWith('bool') &&
        !trimmed.startsWith('string') &&
        !trimmed.startsWith('auto')) {
      errors.push({ 
        message: 'SyntaxError: function declaration missing return type', 
        line: lineNum, 
        column: 1 
      });
    }
    
    // Check for unterminated strings
    const doubleQuotes = (line.match(/(?<!\\)"/g) || []).length;
    const singleQuotes = (line.match(/(?<!\\)'/g) || []).length;
    
    if (doubleQuotes % 2 !== 0) {
      errors.push({ 
        message: 'SyntaxError: unterminated string literal', 
        line: lineNum, 
        column: line.indexOf('"') + 1 
      });
    }
    
    if (singleQuotes % 2 !== 0 && !trimmed.includes("'\\")) {
      errors.push({ 
        message: 'SyntaxError: unterminated character literal', 
        line: lineNum, 
        column: line.indexOf("'") + 1 
      });
    }
  });
  
  // Global checks
  if (lines.length > 5 && !hasMain) {
    errors.push({ 
      message: 'Warning: no main() function found', 
      line: 1, 
      column: 1 
    });
  }
  
  if (braceBalance !== 0) {
    errors.push({ 
      message: `SyntaxError: unmatched braces in file (balance: ${braceBalance > 0 ? '+' : ''}${braceBalance})`, 
      line: lines.length, 
      column: 1 
    });
  }
  
  return errors;
};
