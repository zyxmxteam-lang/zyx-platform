"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = `t${++counter.current}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={16} color="#22c55e" />,
    error: <AlertCircle size={16} color="#ef4444" />,
    info: <Info size={16} color="#3b82f6" />,
  };

  const colors: Record<ToastType, { bg: string; border: string }> = {
    success: { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.25)" },
    error: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)" },
    info: { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.25)" },
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
        {toasts.map(t => (
          <div
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              background: colors[t.type].bg,
              border: `1px solid ${colors[t.type].border}`,
              borderRadius: 12,
              backdropFilter: "blur(12px)",
              backgroundColor: "#111",
              minWidth: 260,
              maxWidth: 380,
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              pointerEvents: "all",
              animation: "slideIn 0.25s ease",
            }}
          >
            <span style={{ flexShrink: 0 }}>{icons[t.type]}</span>
            <span style={{ fontSize: 13.5, color: "#e0e0e0", flex: 1, lineHeight: 1.4 }}>{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#444", flexShrink: 0, display: "flex", padding: 2 }}
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
