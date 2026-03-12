"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, BarChart3, Link2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import URLShortenerForm from "@/components/URLShortenerForm";

const features = [
  { icon: Zap,       title: "Instant",    desc: "Short links in milliseconds, zero friction." },
  { icon: Shield,    title: "Secure",     desc: "JWT-authenticated. Your links stay private." },
  { icon: BarChart3, title: "Analytics",  desc: "Track clicks, measure what matters." },
  { icon: Link2,     title: "Custom",     desc: "Branded aliases. Memorable links." },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <main
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs */}
      <div
        className="orb orb-purple animate-float"
        style={{ width: "700px", height: "700px", top: "-180px", left: "50%", transform: "translateX(-55%)", opacity: 1 }}
      />
      <div
        className="orb orb-warm animate-float"
        style={{ width: "400px", height: "400px", top: "160px", right: "-80px", opacity: 1, animationDelay: "-4s" }}
      />
      <div
        className="orb orb-blue animate-float"
        style={{ width: "350px", height: "350px", bottom: "0px", left: "-80px", opacity: 0.8, animationDelay: "-2s" }}
      />

      {/* ── Hero ── */}
      <section
        className="container"
        style={{
          paddingTop: "clamp(60px, 12vw, 120px)",
          paddingBottom: "clamp(60px, 10vw, 100px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="badge badge-accent" style={{ marginBottom: "28px" }}>
            <Sparkles size={11} strokeWidth={2} />
            Developer-grade URL shortener
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-display"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: "760px", marginBottom: "20px" }}
        >
          Short links,{" "}
          <span className="gradient-text">big impact</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: "clamp(16px, 2.5vw, 19px)",
            color: "var(--text-secondary)",
            lineHeight: 1.65,
            maxWidth: "500px",
            marginBottom: "48px",
            fontWeight: 400,
          }}
        >
          Turn any long URL into a clean, shareable link. Manage everything from one elegant dashboard.
        </motion.p>

        {/* CTA / Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "100%", maxWidth: "600px" }}
        >
          {isAuthenticated ? (
            <URLShortenerForm />
          ) : (
            <div
              className="card card-glow noise"
              style={{
                padding: "clamp(20px, 4vw, 32px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                Sign in to start shortening URLs and tracking analytics
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                <Link href="/signup" className="btn btn-primary" style={{ gap: "8px" }}>
                  Get started free
                  <ArrowRight size={15} />
                </Link>
                <Link href="/login" className="btn btn-secondary">
                  Log in
                </Link>
              </div>
            </div>
          )}
        </motion.div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: "40px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["No credit card", "Instant setup", "Free forever"].map((t, i) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {i > 0 && (
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--border-hover)" }} />
              )}
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="container">
        <div className="divider-h" />
      </div>

      {/* ── Features ── */}
      <section
        className="container"
        style={{
          paddingBlock: "clamp(48px, 8vw, 96px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Section label */}
        <motion.p
          className="text-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "16px" }}
        >
          Everything you need
        </motion.p>

        <motion.h2
          className="text-heading"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 56px)" }}
        >
          Simple by design
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "clamp(10px, 2vw, 16px)",
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="card noise"
              style={{ padding: "clamp(20px, 3vw, 28px)", cursor: "default" }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--accent-dim)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                }}
              >
                <f.icon size={17} style={{ color: "var(--accent)" }} strokeWidth={2} />
              </div>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  marginBottom: "6px",
                  color: "var(--text-primary)",
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ position: "relative", zIndex: 1, paddingBottom: "clamp(60px, 10vw, 120px)" }}>
        <div className="container">
          <div className="divider-h" style={{ marginBottom: "clamp(48px, 8vw, 96px)" }} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "clamp(12px, 2vw, 24px)",
            }}
          >
            {[
              { step: "01", title: "Paste your URL", desc: "Drop any URL into the input. We'll handle the rest." },
              { step: "02", title: "Get your link", desc: "Receive a short code instantly. Custom aliases supported." },
              { step: "03", title: "Share & track", desc: "Share everywhere, check analytics in your dashboard." },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--accent)",
                    background: "var(--accent-dim)",
                    padding: "3px 8px",
                    borderRadius: "5px",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  {s.step}
                </span>
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "5px", color: "var(--text-primary)" }}>
                    {s.title}
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.65 }}>
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
