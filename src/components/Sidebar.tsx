"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ZYXLogoFull } from "./ZYXLogo";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Megaphone,
  TrendingUp,
  BookOpen,
  Calendar,
  Bell,
  Settings,
  User,
  Users,
  CheckSquare,
  Map,
  FileText,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

interface Profile {
  email?: string;
  full_name?: string;
  role?: string;
  avatar_url?: string;
}

interface SidebarProps {
  user?: Profile;
}

const navSections = [
  {
    label: "Análisis",
    items: [
      { href: "/overview", label: "Overview", icon: LayoutDashboard },
      { href: "/campaigns", label: "Campañas Meta", icon: Megaphone },
      { href: "/sales", label: "Ventas & Métricas", icon: TrendingUp },
    ],
  },
  {
    label: "Trabajo",
    items: [
      { href: "/tasks", label: "Tareas", icon: CheckSquare },
      { href: "/planning", label: "Planeación", icon: Map },
      { href: "/docs", label: "Documentos", icon: FileText },
    ],
  },
  {
    label: "Recursos",
    items: [
      { href: "/research", label: "Research Hub", icon: BookOpen },
      { href: "/calendar", label: "Calendario", icon: Calendar },
      { href: "/notifications", label: "Alertas", icon: Bell },
    ],
  },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const initials = user?.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? "ZX";

  return (
    <aside
      style={{
        width: 224,
        minWidth: 224,
        background: "#0a0a0a",
        borderRight: "1px solid #171717",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 50,
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "22px 18px 18px", borderBottom: "1px solid #171717" }}>
        <ZYXLogoFull size={28} />
        <p style={{ color: "#333", fontSize: 10, marginTop: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Plataforma Interna
        </p>
      </div>

      {/* Nav Sections */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 20 }}>
        {navSections.map(section => (
          <div key={section.label}>
            <p style={{ fontSize: 10, color: "#333", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 8px", marginBottom: 4, fontWeight: 600 }}>
              {section.label}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "7px 10px",
                      borderRadius: 7,
                      textDecoration: "none",
                      color: active ? "#ffffff" : "#555",
                      background: active ? "rgba(255,255,255,0.07)" : "transparent",
                      borderLeft: `2px solid ${active ? "#fff" : "transparent"}`,
                      fontSize: 13,
                      fontWeight: active ? 500 : 400,
                      transition: "all 0.12s ease",
                    }}
                  >
                    <Icon size={14} strokeWidth={active ? 2 : 1.5} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom User Menu */}
      <div style={{ borderTop: "1px solid #171717", padding: "10px" }}>
        <Link
          href="/settings"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "7px 10px",
            borderRadius: 7,
            textDecoration: "none",
            color: pathname === "/settings" ? "#fff" : "#555",
            background: pathname === "/settings" ? "rgba(255,255,255,0.07)" : "transparent",
            fontSize: 13,
            transition: "all 0.12s ease",
            marginBottom: 6,
          }}
        >
          <Settings size={14} strokeWidth={1.5} />
          <span>Configuración</span>
        </Link>

        {/* User profile button */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "8px 10px",
              borderRadius: 8,
              background: userMenuOpen ? "rgba(255,255,255,0.05)" : "transparent",
              border: "none",
              cursor: "pointer",
              color: "#ccc",
              textAlign: "left",
              transition: "all 0.12s ease",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2a2a2a, #444)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, color: "#ccc", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.full_name ?? user?.email?.split("@")[0] ?? "Usuario"}
              </p>
              <p style={{ fontSize: 10, color: "#444" }}>
                {user?.role === "admin" ? "Admin" : "Miembro"}
              </p>
            </div>
            <ChevronDown size={12} color="#444" style={{ transform: userMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
          </button>

          {userMenuOpen && (
            <div
              style={{
                position: "absolute",
                bottom: "calc(100% + 4px)",
                left: 0,
                right: 0,
                background: "#111",
                border: "1px solid #222",
                borderRadius: 10,
                padding: "6px",
                zIndex: 100,
                boxShadow: "0 -8px 24px rgba(0,0,0,0.6)",
              }}
            >
              <Link
                href="/profile"
                onClick={() => setUserMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 7, textDecoration: "none", color: "#ccc", fontSize: 13, transition: "background 0.1s" }}
              >
                <User size={14} /> Mi Perfil
              </Link>
              <Link
                href="/team"
                onClick={() => setUserMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 7, textDecoration: "none", color: "#ccc", fontSize: 13 }}
              >
                <Users size={14} /> Equipo
              </Link>
              <div style={{ height: 1, background: "#1c1c1c", margin: "4px 0" }} />
              <button
                onClick={handleSignOut}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 7, background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13, textAlign: "left" }}
              >
                <LogOut size={14} /> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
