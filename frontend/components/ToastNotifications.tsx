"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";

export interface Toast {
  id: string;
  type: "success" | "error";
  message: string;
}

export default function ToastNotifications({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        pointerEvents: "none",
        maxWidth: "340px",
        width: "calc(100vw - 40px)",
      }}
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const ok = toast.type === "success";

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 450, damping: 32 }}
      style={{
        pointerEvents: "all",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 14px",
        borderRadius: "var(--radius-sm)",
        background: "var(--bg-surface)",
        border: `1px solid ${ok ? "var(--success-border)" : "var(--error-border)"}`,
        color: "var(--text-primary)",
        fontSize: "13.5px",
        fontWeight: 500,
        boxShadow: "var(--shadow-lg)",
      }}
    >
      {ok
        ? <CheckCircle2 size={15} style={{ color: "var(--success)", flexShrink: 0 }} />
        : <XCircle     size={15} style={{ color: "var(--error)",   flexShrink: 0 }} />
      }
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", padding: 0 }}
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}

let _id = 0;
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (type: Toast["type"], message: string) =>
    setToasts((p) => [...p, { id: `t-${++_id}`, type, message }]);
  const removeToast = (id: string) =>
    setToasts((p) => p.filter((t) => t.id !== id));
  return { toasts, addToast, removeToast };
}
