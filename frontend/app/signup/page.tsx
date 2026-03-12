"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedButton from "@/components/AnimatedButton";
import { apiSignup } from "@/lib/api";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName:  z.string().min(1, "Required"),
  email:     z.string().email("Invalid email"),
  password:  z.string().min(8, "Min. 8 characters"),
});
type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      await apiSignup(data);
      router.push("/login?registered=1");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
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
      {/* Ambient */}
      <div
        className="orb orb-purple"
        style={{ width: "500px", height: "500px", top: "-100px", left: "50%", transform: "translateX(-50%)", opacity: 0.5 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "6px" }}>
            Create account
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Already have one?{" "}
            <Link href="/login" style={{ color: "var(--accent-bright)", textDecoration: "none", fontWeight: 500 }}>
              Log in
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="card card-glow noise" style={{ padding: "clamp(20px,4vw,28px)" }}>
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
            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <Field label="First name" error={errors.firstName?.message}>
                <div className={`input-wrap ${errors.firstName ? "error" : ""}`}>
                  <User size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                  <input {...register("firstName")} placeholder="John" id="firstName" />
                </div>
              </Field>
              <Field label="Last name" error={errors.lastName?.message}>
                <div className={`input-wrap ${errors.lastName ? "error" : ""}`}>
                  <User size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                  <input {...register("lastName")} placeholder="Doe" id="lastName" />
                </div>
              </Field>
            </div>

            <Field label="Email" error={errors.email?.message}>
              <div className={`input-wrap ${errors.email ? "error" : ""}`}>
                <Mail size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                <input {...register("email")} type="email" placeholder="you@example.com" id="email" />
              </div>
            </Field>

            <Field label="Password" error={errors.password?.message}>
              <div className={`input-wrap ${errors.password ? "error" : ""}`}>
                <Lock size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                <input
                  {...register("password")}
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  id="password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", padding: 0, flexShrink: 0 }}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </Field>

            <AnimatedButton type="submit" loading={loading} size="lg" style={{ width: "100%", marginTop: "4px" }}>
              Create account
            </AnimatedButton>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "12px", color: "var(--text-muted)" }}>
          By signing up, you agree to our Terms of Service
        </p>
      </motion.div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
