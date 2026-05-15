"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string | number;
  change: string;
  up: boolean;
  prefix?: string;
  suffix?: string;
  description?: string;
  color?: string;
}

export default function KPICard({
  label,
  value,
  change,
  up,
  prefix = "",
  suffix = "",
  description,
  color = "#fff",
}: KPICardProps) {
  return (
    <div
      className="card-hover fade-in"
      style={{
        background: "#111",
        border: "1px solid #1c1c1c",
        borderRadius: 12,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <p style={{ fontSize: 11.5, color: "#555", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>
        {label}
      </p>
      <p style={{ fontSize: 28, fontWeight: 700, color, letterSpacing: "-0.03em", lineHeight: 1 }}>
        {prefix}{typeof value === "number" ? value.toLocaleString("es-MX") : value}{suffix}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        {up ? (
          <TrendingUp size={13} color="#22c55e" />
        ) : (
          <TrendingDown size={13} color="#ef4444" />
        )}
        <span style={{ fontSize: 12, color: up ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
          {change}
        </span>
        {description && (
          <span style={{ fontSize: 12, color: "#444" }}>{description}</span>
        )}
      </div>
    </div>
  );
}
