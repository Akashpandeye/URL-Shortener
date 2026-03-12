"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, RefreshCw, Link2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardTable from "@/components/DashboardTable";
import URLShortenerForm from "@/components/URLShortenerForm";
import ToastNotifications, { useToast } from "@/components/ToastNotifications";
import AnimatedButton from "@/components/AnimatedButton";
import { apiGetCodes, apiDeleteUrl } from "@/lib/api";
import type { ShortLink } from "@/types";

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGetCodes();
      setLinks(data);
    } catch {
      addToast("error", "Failed to load links.");
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAuthenticated) fetchLinks();
  }, [isAuthenticated, fetchLinks]);

  const handleDelete = async (id: string) => {
    await apiDeleteUrl(id);
    setLinks((p) => p.filter((l) => l.id !== id));
    addToast("success", "Link deleted");
  };

  const handleNewLink = (link: ShortLink) => {
    setLinks((p) => [link, ...p]);
    setShowForm(false);
    addToast("success", `/${link.shortCode} created`);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container" style={{ paddingBlock: "clamp(32px, 6vw, 64px)" }}>
      <ToastNotifications toasts={toasts} onRemove={removeToast} />

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "clamp(24px, 4vw, 40px)",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: "clamp(20px,4vw,26px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "3px" }}>
            My links
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            {loading ? "Loading…" : `${links.length} link${links.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <AnimatedButton variant="secondary" icon={<RefreshCw size={13} />} onClick={fetchLinks} disabled={loading}>
            <span className="hide-mobile">Refresh</span>
          </AnimatedButton>
          <AnimatedButton icon={<Plus size={14} />} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "New link"}
          </AnimatedButton>
        </div>
      </motion.div>

      {/* Create form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "20px", maxWidth: "600px" }}
        >
          <URLShortenerForm onSuccess={handleNewLink} />
        </motion.div>
      )}

      {/* Stats row */}
      {!loading && links.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "8px",
            marginBottom: "20px",
          }}
        >
          {[
            { label: "Total links", value: links.length, mono: false },
            { label: "Today", value: links.filter((l) => new Date(l.createdAt).toDateString() === new Date().toDateString()).length, mono: false },
            { label: "Latest", value: links[0] ? `/${links[0].shortCode}` : "—", mono: true },
          ].map((s) => (
            <div
              key={s.label}
              className="card"
              style={{ padding: "14px 18px" }}
            >
              <p className="text-label" style={{ marginBottom: "6px" }}>{s.label}</p>
              <p
                className={s.mono ? "mono" : ""}
                style={{
                  fontSize: s.mono ? "14px" : "22px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && links.length === 0 && !showForm ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              width: "100%",
              padding: "48px 24px",
              border: "1px dashed var(--border)",
              borderRadius: "var(--radius-md)",
              background: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              color: "var(--text-muted)",
              fontFamily: "inherit",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-bright)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
            }}
          >
            <Link2 size={24} />
            <span style={{ fontSize: "14px", fontWeight: 500 }}>Create your first link</span>
          </button>
        </motion.div>
      ) : (
        <DashboardTable links={links} loading={loading} onDelete={handleDelete} />
      )}
    </div>
  );
}
