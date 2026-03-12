"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

const links = {
  product: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Analytics", href: "/analytics" },
    { label: "Create link", href: "/" },
  ],
  account: [
    { label: "Sign up", href: "/signup" },
    { label: "Log in", href: "/login" },
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        paddingBlock: "var(--space-12) var(--space-8)",
        marginTop: "auto",
      }}
    >
      <div className="container">
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto",
            gap: "var(--space-12)",
            marginBottom: "var(--space-10)",
            alignItems: "start",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div style={{ maxWidth: "260px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "7px",
                  background: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={13} color="white" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
                snip<span style={{ color: "var(--accent)" }}>.</span>ly
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 }}>
              Minimal, developer-grade URL shortener. Built for speed.
            </p>
          </div>

          {/* Product links */}
          <FooterCol title="Product" links={links.product} />
          <FooterCol title="Account" links={links.account} />
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: "var(--space-6)",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "var(--space-3)",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} snip.ly
          </span>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>

          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
          .footer-grid > :first-child {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-label" style={{ marginBottom: "14px" }}>{title}</p>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
