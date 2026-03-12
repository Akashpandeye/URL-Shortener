"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Link2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AnalyticsChart from "@/components/AnalyticsChart";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { apiGetCodes } from "@/lib/api";
import type { ShortLink } from "@/types";
import { formatDate, truncateUrl } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function AnalyticsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLink, setSelectedLink] = useState<ShortLink | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const fetchLinks = useCallback(async () => {
    try {
      const data = await apiGetCodes();
      setLinks(data);
      if (data.length > 0) setSelectedLink(data[0]);
    } catch {
      // handle error silently, show empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchLinks();
  }, [isAuthenticated, fetchLinks]);

  if (!isAuthenticated) return null;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 24px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "40px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <div
            style={{
              background: "var(--color-accent-subtle)",
              padding: "8px",
              borderRadius: "10px",
              display: "flex",
            }}
          >
            <BarChart3 size={18} style={{ color: "var(--color-accent)" }} />
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.03em" }}>
            Analytics
          </h1>
        </div>
        <p style={{ color: "var(--color-text-muted)", fontSize: "14px", marginLeft: "48px" }}>
          Select a link to view its performance metrics
        </p>
      </motion.div>

      {loading ? (
        <LoadingSkeleton rows={3} />
      ) : links.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--color-text-muted)" }}>
          <BarChart3 size={40} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
          <p style={{ fontSize: "16px", fontWeight: 500, color: "var(--color-text-secondary)" }}>
            No links to analyze
          </p>
          <p style={{ fontSize: "13px", marginTop: "6px" }}>
            Create your first short link from the dashboard
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "20px" }}>
          {/* Link selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "12px",
              }}
            >
              Your links
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {links.map((link) => {
                const isSelected = selectedLink?.id === link.id;
                return (
                  <motion.button
                    key={link.id}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedLink(link)}
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: `1px solid ${isSelected ? "var(--color-accent)" : "var(--color-border)"}`,
                      background: isSelected ? "var(--color-accent-subtle)" : "transparent",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <Link2
                        size={13}
                        style={{ color: isSelected ? "var(--color-accent)" : "var(--color-text-muted)", flexShrink: 0 }}
                      />
                      <span
                        className="font-mono"
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: isSelected ? "var(--color-accent-hover)" : "var(--color-text-primary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        /{link.shortCode}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--color-text-muted)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {truncateUrl(link.targetUrl, 35)}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Analytics panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {selectedLink && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Link info */}
                <div className="glass" style={{ padding: "20px 24px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <a
                        href={`${API_URL}/${selectedLink.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "var(--color-accent-hover)",
                          textDecoration: "none",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "16px",
                          fontWeight: 700,
                          marginBottom: "4px",
                        }}
                      >
                        /{selectedLink.shortCode}
                        <ExternalLink size={13} />
                      </a>
                      <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                        {truncateUrl(selectedLink.targetUrl, 70)}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: "11px", color: "var(--color-text-muted)", marginBottom: "2px" }}>
                        Created
                      </p>
                      <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                        {formatDate(selectedLink.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="glass" style={{ padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <TrendingUp size={16} style={{ color: "var(--color-accent)" }} />
                    <h3 style={{ fontSize: "14px", fontWeight: 600 }}>Click activity</h3>
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        background: "var(--color-accent-subtle)",
                        color: "var(--color-accent-hover)",
                        fontWeight: 500,
                      }}
                    >
                      Demo data
                    </span>
                  </div>
                  <AnalyticsChart shortCode={selectedLink.shortCode} />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
