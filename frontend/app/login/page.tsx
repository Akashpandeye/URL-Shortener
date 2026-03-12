"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AnimatedButton from "@/components/AnimatedButton";
import { apiLogin } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  email:    z.string().email("Invalid email"),
  password: z.string().min(8, "Min. 8 characters"),
});
type FormData = z.infer<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);

  const registered = params.get("registered");

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiLogin(data);
      login(res.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100dvh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(24px,6vw,64px) var(--space-4)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="orb orb-purple"
        style={{ width: "500px", height: "500px", top: "-100px", left: "50%", transform: "translateX(-50%)", opacity: 0.5 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", maxWidth: "380px", position: "relative", zIndex: 1 }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "6px" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: "var(--accent-bright)", textDecoration: "none", fontWeight: 500 }}>
              Sign up
            </Link>
          </p>
        </div>

        <div className="card card-glow noise" style={{ padding: "clamp(20px,4vw,28px)" }}>
          {/* Registered notice */}
          {registered && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "11px 14px",
                borderRadius: "var(--radius-xs)",
                background: "var(--success-dim)",
                border: "1px solid rgba(52,211,153,0.2)",
                color: "var(--success)",
                fontSize: "13px",
                marginBottom: "18px",
              }}
            >
              <CheckCircle size={14} />
              Account created! Please log in.
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "11px 14px",
                borderRadius: "var(--radius-xs)",
                background: "var(--error-dim)",
                border: "1px solid rgba(248,113,113,0.2)",
                color: "var(--error)",
                fontSize: "13px",
                marginBottom: "18px",
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label className="field-label" htmlFor="email">Email</label>
              <div className={`input-wrap ${errors.email ? "error" : ""}`}>
                <Mail size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                <input {...register("email")} type="email" id="email" placeholder="you@example.com" />
              </div>
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="field-label" htmlFor="password">Password</label>
              <div className={`input-wrap ${errors.password ? "error" : ""}`}>
                <Lock size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                <input
                  {...register("password")}
                  type={showPw ? "text" : "password"}
                  id="password"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", padding: 0, flexShrink: 0 }}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>

            <AnimatedButton type="submit" loading={loading} size="lg" style={{ width: "100%", marginTop: "4px" }}>
              Log in
            </AnimatedButton>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
