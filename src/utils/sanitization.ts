/**
 * Frontend Output Sanitization Utilities
 * Handles safe display of code execution results
 */

/**
 * Escape HTML special characters for safe display
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML
 */
export const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

/**
 * Sanitize code execution output for safe display
 * @param {string} output - Raw output from code execution
 * @returns {string} Sanitized output
 */
export const sanitizeCodeOutput = (output: string): string => {
  if (!output || typeof output !== 'string') {
    return '';
  }

  // Already escaped by backend, but ensure safety
  return escapeHtml(output);
};

/**
 * Format code output with line numbers
 * @param {string} output - Code output
 * @returns {JSX.Element} Formatted output with line numbers
 */
export const formatCodeOutput = (output: string): string[] => {
  if (!output) return [];

  return output.split('\n').map((line, index) => {
    return `${String(index + 1).padStart(4, ' ')} | ${line}`;
  });
};

/**
 * Detect and highlight error patterns in output
 * @param {string} output - Output to analyze
 * @returns {object} { isError: boolean, errorType: string, message: string }
 */
export const detectErrorPattern = (output: string): {
  isError: boolean;
  errorType: string;
  message: string;
} => {
  if (!output) {
    return { isError: false, errorType: '', message: '' };
  }

  const lowerOutput = output.toLowerCase();

  // Python error patterns
  if (lowerOutput.includes('error') || lowerOutput.includes('traceback')) {
    return {
      isError: true,
      errorType: 'python',
      message: 'Python runtime error detected'
    };
  }

  // C++ error patterns
  if (lowerOutput.includes('segmentation fault') || lowerOutput.includes('core dumped')) {
    return {
      isError: true,
      errorType: 'cpp',
      message: 'C++ segmentation fault'
    };
  }

  // JavaScript error patterns
  if (lowerOutput.includes('error') || lowerOutput.includes('uncaught')) {
    return {
      isError: true,
      errorType: 'javascript',
      message: 'JavaScript runtime error'
    };
  }

  return { isError: false, errorType: '', message: '' };
};

/**
 * Sanitize error messages from API responses
 * @param {string} error - Error message from API
 * @returns {string} Sanitized error message
 */
export const sanitizeErrorMessage = (error: string): string => {
  if (!error || typeof error !== 'string') {
    return 'An unknown error occurred';
  }

  // Backend should have already escaped, but ensure safety
  return escapeHtml(error).substring(0, 1000); // Limit to 1000 chars
};

/**
 * Validate code input before submission
 * @param {string} code - Code to validate
 * @param {string} language - Programming language
 * @returns {object} { isValid: boolean, errors: string[], warnings: string[] }
 */
export const validateCodeInput = (
  code: string,
  language: string
): { isValid: boolean; errors: string[]; warnings?: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!code || code.trim().length === 0) {
    errors.push('Code cannot be empty');
  }

  if (code.length > 10 * 1024 * 1024) {
    errors.push('Code exceeds maximum size of 10MB');
  }

  if (!['python', 'cpp', 'javascript'].includes(language)) {
    errors.push('Invalid programming language selected');
  }

  // Warn about potentially suspicious patterns - don't block execution
  const suspiciousPatterns: { [key: string]: RegExp[] } = {
    python: [/import\s+os/gi, /import\s+sys/gi, /eval\s*\(/gi],
    cpp: [/system\s*\(/gi, /fork\s*\(/gi],
    javascript: [/require\s*\(\s*['"]fs['"]\s*\)/gi, /eval\s*\(/gi]
  };

  const patterns = suspiciousPatterns[language] || [];
  const foundPatterns: string[] = [];

  patterns.forEach((pattern) => {
    if (pattern.test(code)) {
      foundPatterns.push(pattern.source);
    }
  });

  if (foundPatterns.length > 0) {
    warnings.push(
      `⚠️ Warning: Potentially unsafe patterns detected (${foundPatterns.join(', ')}). The code execution environment may block or restrict this code.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Format execution result for display
 * @param {object} result - Execution result from API
 * @returns {object} Formatted result
 */
export const formatExecutionResult = (result: {
  output?: string;
  error?: string;
  exitCode?: number;
  executionTime?: number;
}): {
  output: string;
  error: string;
  exitCode: number;
  executionTime: number;
  formattedOutput: string[];
  formattedError: string[];
  hasError: boolean;
} => {
  const output = sanitizeCodeOutput(result.output || '');
  const error = sanitizeErrorMessage(result.error || '');
  const exitCode = result.exitCode || 0;
  const executionTime = result.executionTime || 0;

  return {
    output,
    error,
    exitCode,
    executionTime,
    formattedOutput: formatCodeOutput(output),
    formattedError: formatCodeOutput(error),
    hasError: exitCode !== 0 || error.length > 0
  };
};

/**
 * Sanitize user input for code execution API
 * @param {object} request - { code, language, input }
 * @returns {object} Sanitized request ready for API
 */
export const sanitizeExecutionRequest = (request: {
  code: string;
  language: string;
  input?: string;
}): {
  code: string;
  language: string;
  input: string;
} => {
  return {
    code: (request.code || '').trim(),
    language: (request.language || '').toLowerCase(),
    input: (request.input || '').trim()
  };
};

/**
 * Log suspicious activity for monitoring
 * @param {object} activity - Activity details
 */
export const logSuspiciousActivity = (activity: {
  type: string;
  message: string;
  timestamp: Date;
  userCode?: string;
  language?: string;
}): void => {
  const safeActivity = {
    type: activity.type,
    message: activity.message,
    timestamp: activity.timestamp,
    // Don't log actual code for privacy, just language
    language: activity.language || 'unknown'
  };

  console.warn('[Security Alert]', safeActivity);

  // In production, send to logging service
  // apiClient.post('/api/security/log', safeActivity);
};

/**
 * REACT COMPONENTS
 * 
 * Create these components in your React files as needed:
 * 
 * export const CodeOutputDisplay: React.FC<{ output: string; isError?: boolean }> = ({
 *   output,
 *   isError = false
 * }) => {
 *   const sanitized = sanitizeCodeOutput(output);
 *   const formatted = formatCodeOutput(sanitized);
 * 
 *   return (
 *     <div className={`code-output ${isError ? 'error' : 'success'}`}>
 *       <pre>
 *         {formatted.map((line, index) => (
 *           <div key={index} className="output-line">
 *             {line}
 *           </div>
 *         ))}
 *       </pre>
 *     </div>
 *   );
 * };
 * 
 * export const SafeOutputViewer: React.FC<{
 *   output: string;
 *   className?: string;
 * }> = ({ output, className = '' }) => {
 *   const sanitized = sanitizeCodeOutput(output);
 *   return (
 *     <pre className={`safe-output-viewer ${className}`}>
 *       {sanitized}
 *     </pre>
 *   );
 * };
 */

export default {
  escapeHtml,
  sanitizeCodeOutput,
  formatCodeOutput,
  detectErrorPattern,
  sanitizeErrorMessage,
  validateCodeInput,
  formatExecutionResult,
  sanitizeExecutionRequest,
  logSuspiciousActivity
};
