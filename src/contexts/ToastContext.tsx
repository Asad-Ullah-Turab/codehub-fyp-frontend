import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Toast from "../components/Toast/Toast";

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "warning" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);

  const stripEmojis = (text: string) => text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim();

  const showToast = useCallback((message: string, type: "success" | "error" | "warning" | "info" = "info") => {
    const sanitized = stripEmojis(message);
    setToast({ message: sanitized, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        <AnimatePresence>
          {toast && (
            <Toast
              key={`${toast.type}-${toast.message}`}
              message={toast.message}
              type={toast.type}
              onClose={closeToast}
            />
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback for safety: return a no-op implementation so components don't crash
    // when rendered outside the provider (useful during isolated testing or dev mistakes).
    // Also log a developer warning so the missing provider can be fixed.
    // NOTE: Prefer fixing the app root to include <ToastProvider />; this is a safe fallback.
    // eslint-disable-next-line no-console
    console.warn("useToast called outside ToastProvider — returning no-op showToast.");
    return { showToast: (_message: string, _type: "success" | "error" | "warning" | "info" = "info") => {
      /* no-op */
    } };
  }
  return context;
};
