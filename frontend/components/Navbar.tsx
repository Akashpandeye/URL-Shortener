"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Zap, LayoutDashboard, BarChart3, LogOut, LogIn, UserPlus } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border)",
        background: "rgba(233,228,218,0.9)",
        backdropFilter: "blur(20px) saturate(1.6)",
        WebkitBackdropFilter: "blur(20px) saturate(1.6)",
      }}
    >
      <nav
        className="container"
        style={{
          height: "58px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-4)",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 12px var(--accent-glow)",
            }}
          >
            <Zap size={14} color="white" strokeWidth={2.5} />
          </motion.div>
          <span
            style={{
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
            }}
          >
            snip<span style={{ color: "var(--accent)" }}>.</span>ly
          </span>
        </Link>

        {/* Nav items */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {isAuthenticated ? (
            <>
              <NavItem href="/dashboard" icon={<LayoutDashboard size={14} />} active={pathname === "/dashboard"}>
                Dashboard
              </NavItem>
              <NavItem href="/analytics" icon={<BarChart3 size={14} />} active={pathname === "/analytics"}>
                Analytics
              </NavItem>
              <div style={{ width: "1px", height: "18px", background: "var(--border)", margin: "0 4px" }} />
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="btn btn-ghost btn-sm"
                style={{ gap: "6px" }}
              >
                <LogOut size={13} />
                <span className="hide-mobile">Logout</span>
              </motion.button>
            </>
          ) : (
            <>
              <NavItem href="/login" icon={<LogIn size={14} />} active={pathname === "/login"}>
                Log in
              </NavItem>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/signup"
                  className="btn btn-primary btn-sm"
                  style={{ gap: "6px" }}
                >
                  <UserPlus size={13} />
                  Sign up
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function NavItem({
  href,
  children,
  icon,
  active,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
      <Link
        href={href}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "7px 12px",
          borderRadius: "var(--radius-xs)",
          fontSize: "14px",
          fontWeight: active ? 600 : 500,
          color: active ? "var(--text-primary)" : "var(--text-secondary)",
          background: active ? "var(--bg-elevated)" : "transparent",
          textDecoration: "none",
          transition: "color 0.15s, background 0.15s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
        }}
        onMouseLeave={(e) => {
          if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
        }}
      >
        {icon}
        <span className="hide-mobile">{children}</span>
      </Link>
    </motion.div>
  );
}
