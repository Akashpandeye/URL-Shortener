"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

type MotionButtonProps = Omit<HTMLMotionProps<"button">, "ref">;

interface ButtonProps extends MotionButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClass = {
  primary:   "btn btn-primary",
  secondary: "btn btn-secondary",
  ghost:     "btn btn-ghost",
  danger:    "btn btn-danger",
};

const sizeClass = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

export default function AnimatedButton({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={isDisabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={isDisabled ? {} : { scale: 0.97, y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      disabled={isDisabled}
      className={[variantClass[variant], sizeClass[size], className ?? ""].join(" ").trim()}
      {...props}
    >
      {loading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex" }}
        >
          <Loader2 size={size === "lg" ? 17 : 14} />
        </motion.span>
      ) : icon ? (
        <span style={{ display: "flex" }}>{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}
