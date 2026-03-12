"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ArrowUpRight, Calendar } from "lucide-react";
import CopyButton from "./CopyButton";
import AnimatedButton from "./AnimatedButton";
import LoadingSkeleton from "./LoadingSkeleton";
import type { ShortLink } from "@/types";
import { formatDate, truncateUrl } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface Props {
  links: ShortLink[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
}

export default function DashboardTable({ links, loading, onDelete }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try { await onDelete(id); } finally { setDeletingId(null); }
  };

  if (loading) return <LoadingSkeleton rows={4} />;

  if (links.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          textAlign: "center",
          padding: "64px 24px",
          color: "var(--text-muted)",
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "4px" }}>
          No links yet
        </p>
        <p style={{ fontSize: "13px" }}>Create your first short link above</p>
      </motion.div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <AnimatePresence initial={false}>
        {links.map((link, i) => (
          <motion.div
            key={link.id}
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: "hidden" }}
            transition={{ duration: 0.22, delay: i < 4 ? i * 0.04 : 0 }}
            whileHover={{ borderColor: "var(--border-hover)" }}
            className="card"
            style={{
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              transition: "border-color 0.15s",
            }}
          >
            {/* Short code */}
            <a
              href={`${API_URL}/${link.shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "var(--accent-bright)",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 600,
                flexShrink: 0,
                minWidth: "100px",
                transition: "color 0.15s",
              }}
              className="mono"
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--accent-bright)")}
            >
              /{link.shortCode}
              <ArrowUpRight size={11} />
            </a>

            <div className="divider" />

            {/* Target */}
            <p
              style={{
                flex: 1,
                fontSize: "13px",
                color: "var(--text-muted)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}
            >
              {truncateUrl(link.targetUrl, 65)}
            </p>

            {/* Date — hidden on very small screens */}
            <div
              className="hide-mobile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                color: "var(--text-muted)",
                fontSize: "11.5px",
                flexShrink: 0,
              }}
            >
              <Calendar size={11} />
              {formatDate(link.createdAt)}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "6px", flexShrink: 0, alignItems: "center" }}>
              <CopyButton text={`${API_URL}/${link.shortCode}`} size="sm" />
              <AnimatedButton
                variant="danger"
                size="sm"
                loading={deletingId === link.id}
                onClick={() => handleDelete(link.id)}
                icon={<Trash2 size={12} />}
              >
                <span className="hide-mobile">{deletingId === link.id ? "" : "Delete"}</span>
              </AnimatedButton>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
