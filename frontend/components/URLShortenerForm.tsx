"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Wand2, CheckCircle2, ExternalLink, ChevronDown, SlidersHorizontal } from "lucide-react";
import AnimatedButton from "./AnimatedButton";
import CopyButton from "./CopyButton";
import { apiShortenUrl } from "@/lib/api";
import type { ShortLink } from "@/types";

const schema = z.object({
  url: z.string().url("Enter a valid URL (include https://)"),
  code: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function URLShortenerForm({ onSuccess }: { onSuccess?: (link: ShortLink) => void }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShortLink | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const link = await apiShortenUrl({ url: data.url, code: data.code || undefined });
      setResult(link);
      onSuccess?.(link);
      reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const shortUrl = result ? `${API_URL}/${result.shortCode}` : "";

  return (
    <div style={{ width: "100%" }}>
      <motion.div
        className="card card-glow noise"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ padding: "clamp(16px, 3vw, 24px)" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Main input row */}
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div
                className={`input-wrap ${errors.url ? "error" : ""}`}
                style={{ fontSize: "14px" }}
              >
                <Link2 size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                <input
                  {...register("url")}
                  placeholder="Paste a long URL to shorten…"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
              {errors.url && (
                <p className="field-error">{errors.url.message}</p>
              )}
            </div>

            <AnimatedButton
              type="submit"
              loading={loading}
              icon={<Wand2 size={14} />}
              style={{ flexShrink: 0, height: "44px", paddingInline: "18px" }}
            >
              Shorten
            </AnimatedButton>
          </div>

          {/* Advanced toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              marginTop: "10px",
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "inherit",
              padding: "2px 0",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <SlidersHorizontal size={12} />
            Custom alias
            <motion.span
              animate={{ rotate: showAdvanced ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex" }}
            >
              <ChevronDown size={12} />
            </motion.span>
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ paddingTop: "10px" }}>
                  <label className="field-label">Custom alias <span style={{ color: "var(--text-muted)" }}>(optional)</span></label>
                  <div className="input-wrap">
                    <span style={{ color: "var(--text-muted)", fontSize: "13px", flexShrink: 0 }}>snip.ly/</span>
                    <input
                      {...register("code")}
                      placeholder="my-link"
                      className="mono"
                      style={{ fontSize: "13px" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: "12px",
              padding: "10px 14px",
              borderRadius: "var(--radius-xs)",
              background: "var(--error-dim)",
              border: "1px solid rgba(248,113,113,0.2)",
              color: "var(--error)",
              fontSize: "13px",
            }}
          >
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{ marginTop: "8px" }}
          >
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "var(--radius-sm)",
                background: "var(--success-dim)",
                border: "1px solid rgba(52,211,153,0.2)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                style={{ display: "flex", flexShrink: 0 }}
              >
                <CheckCircle2 size={16} style={{ color: "var(--success)" }} />
              </motion.div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, minWidth: 0 }}>
                <ExternalLink size={13} style={{ color: "var(--success)", flexShrink: 0 }} />
                <span
                  className="mono"
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--success)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {shortUrl}
                </span>
              </div>

              <div style={{ display: "flex", gap: "8px", flexShrink: 0, alignItems: "center" }}>
                <CopyButton text={shortUrl} size="sm" />
                <button
                  onClick={() => setResult(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    padding: "4px 2px",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                >
                  New →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
