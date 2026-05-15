"use client";

import { Search, Bell, RefreshCw } from "lucide-react";
import { notifications } from "@/lib/data";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <header
      style={{
        padding: "20px 32px",
        borderBottom: "1px solid #1c1c1c",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#080808",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: "#555", marginTop: 2 }}>{subtitle}</p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#111",
            border: "1px solid #222",
            borderRadius: 8,
            padding: "7px 14px",
            minWidth: 220,
          }}
        >
          <Search size={14} color="#444" />
          <input
            placeholder="Buscar..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#ccc",
              fontSize: 13,
              width: "100%",
            }}
          />
        </div>

        {/* Refresh */}
        <button
          style={{
            background: "#111",
            border: "1px solid #222",
            borderRadius: 8,
            padding: "7px 10px",
            cursor: "pointer",
            color: "#555",
            display: "flex",
            alignItems: "center",
            transition: "all 0.15s ease",
          }}
          title="Actualizar datos"
        >
          <RefreshCw size={15} />
        </button>

        {/* Notifications */}
        <button
          style={{
            background: "#111",
            border: "1px solid #222",
            borderRadius: 8,
            padding: "7px 10px",
            cursor: "pointer",
            color: "#555",
            display: "flex",
            alignItems: "center",
            position: "relative",
            transition: "all 0.15s ease",
          }}
        >
          <Bell size={15} />
          {unread > 0 && (
            <span
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                width: 7,
                height: 7,
                background: "#ef4444",
                borderRadius: "50%",
                border: "1.5px solid #080808",
              }}
              className="pulse-dot"
            />
          )}
        </button>

        {/* Date */}
        <span style={{ fontSize: 12, color: "#444", whiteSpace: "nowrap" }}>
          {new Date().toLocaleDateString("es-MX", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>
    </header>
  );
}
