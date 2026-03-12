"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text, size = "md" }: { text: string; size?: "sm" | "md" }) {
  const [copied, setCopied] = useState(false);

  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button
      onClick={copy}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.93 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: size === "sm" ? "5px 10px" : "7px 13px",
        borderRadius: "var(--radius-xs)",
        border: `1px solid ${copied ? "rgba(52,211,153,0.3)" : "var(--border)"}`,
        background: copied ? "var(--success-dim)" : "var(--bg-elevated)",
        color: copied ? "var(--success)" : "var(--text-secondary)",
        fontSize: size === "sm" ? "12px" : "13px",
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
        transition: "all 0.18s ease",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 600, damping: 22 }}
            style={{ display: "flex" }}
          >
            <Check size={size === "sm" ? 11 : 13} strokeWidth={2.5} />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            style={{ display: "flex" }}
          >
            <Copy size={size === "sm" ? 11 : 13} />
          </motion.span>
        )}
      </AnimatePresence>
      {copied ? "Copied" : "Copy"}
    </motion.button>
  );
}
