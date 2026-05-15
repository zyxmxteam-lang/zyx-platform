"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ZYXLogoFull } from "./ZYXLogo";
import {
  LayoutDashboard,
  Megaphone,
  TrendingUp,
  BookOpen,
  Calendar,
  Settings,
  Bell,
} from "lucide-react";
import { notifications } from "@/lib/data";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campañas Meta", icon: Megaphone },
  { href: "/sales", label: "Ventas & Métricas", icon: TrendingUp },
  { href: "/research", label: "Research Hub", icon: BookOpen },
  { href: "/calendar", label: "Calendario", icon: Calendar },
  { href: "/notifications", label: "Alertas", icon: Bell, badge: notifications.filter(n => !n.read).length },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        minWidth: 240,
        background: "#0d0d0d",
        borderRight: "1px solid #1c1c1c",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "28px 20px 24px", borderBottom: "1px solid #1c1c1c" }}>
        <ZYXLogoFull size={32} />
        <p style={{ color: "#555", fontSize: 11, marginTop: 8, letterSpacing: "0.05em" }}>
          PLATAFORMA INTERNA
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                textDecoration: "none",
                color: active ? "#ffffff" : "#666",
                background: active ? "rgba(255,255,255,0.07)" : "transparent",
                borderLeft: active ? "2px solid #fff" : "2px solid transparent",
                fontSize: 13.5,
                fontWeight: active ? 500 : 400,
                letterSpacing: "0.01em",
                transition: "all 0.15s ease",
                position: "relative",
              }}
              className="sidebar-item"
            >
              <Icon size={16} strokeWidth={active ? 2 : 1.5} />
              <span>{label}</span>
              {badge ? (
                <span
                  style={{
                    marginLeft: "auto",
                    background: "#ef4444",
                    color: "white",
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: 10,
                    padding: "1px 6px",
                    minWidth: 18,
                    textAlign: "center",
                  }}
                >
                  {badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid #1c1c1c" }}>
        <Link
          href="/settings"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            borderRadius: 8,
            textDecoration: "none",
            color: "#555",
            fontSize: 13.5,
            transition: "all 0.15s ease",
          }}
          className="sidebar-item"
        >
          <Settings size={16} strokeWidth={1.5} />
          <span>Configuración</span>
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 12px 0",
            marginTop: 8,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #333, #555)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            DS
          </div>
          <div>
            <p style={{ fontSize: 12, color: "#ccc", fontWeight: 500 }}>Diego S.</p>
            <p style={{ fontSize: 10, color: "#444" }}>Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
