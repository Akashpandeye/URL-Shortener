export default function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: "58px", borderRadius: "var(--radius-sm)", opacity: 1 - i * 0.18 }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
      <div className="skeleton" style={{ height: "18px", width: "45%", borderRadius: "5px" }} />
      <div className="skeleton" style={{ height: "14px", width: "72%", borderRadius: "5px" }} />
      <div className="skeleton" style={{ height: "14px", width: "58%", borderRadius: "5px" }} />
    </div>
  );
}
