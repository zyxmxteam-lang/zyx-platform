"use client";

import Header from "@/components/Header";
import { ZYXLogoFull } from "@/components/ZYXLogo";
import { Link2, Shield, Bell, Palette, Database, Users } from "lucide-react";

const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{size?: number, color?: string}>; children: React.ReactNode }) => (
  <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, overflow: "hidden" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 22px", borderBottom: "1px solid #1c1c1c" }}>
      <Icon size={15} color="#555" />
      <h3 style={{ fontSize: 13, fontWeight: 600, color: "#888" }}>{title}</h3>
    </div>
    <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
      {children}
    </div>
  </div>
);

const Row = ({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
    <div>
      <p style={{ fontSize: 13.5, color: "#ccc" }}>{label}</p>
      {desc && <p style={{ fontSize: 11.5, color: "#555", marginTop: 2 }}>{desc}</p>}
    </div>
    {children}
  </div>
);

const Input = ({ defaultValue, placeholder }: { defaultValue?: string; placeholder?: string }) => (
  <input
    defaultValue={defaultValue}
    placeholder={placeholder}
    style={{
      background: "#0d0d0d",
      border: "1px solid #222",
      borderRadius: 8,
      padding: "8px 12px",
      color: "#ccc",
      fontSize: 13,
      outline: "none",
      width: 240,
    }}
  />
);

const Toggle = ({ on }: { on: boolean }) => (
  <div style={{ width: 40, height: 22, borderRadius: 11, background: on ? "#22c55e" : "#222", cursor: "pointer", position: "relative", border: `1px solid ${on ? "#22c55e" : "#333"}` }}>
    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "white", position: "absolute", top: 2, left: on ? 20 : 2, transition: "left 0.2s" }} />
  </div>
);

export default function SettingsPage() {
  return (
    <div style={{ padding: "0 0 40px" }}>
      <Header title="Configuración" subtitle="Preferencias y conexiones de la plataforma ZYX" />

      <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 700 }}>

        {/* Brand */}
        <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ background: "#0d0d0d", border: "1px solid #1c1c1c", borderRadius: 12, padding: "16px 20px" }}>
              <ZYXLogoFull size={36} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.05em" }}>ZYX</h2>
              <p style={{ fontSize: 13, color: "#555", marginTop: 2 }}>Plataforma Interna — v1.0.0</p>
              <p style={{ fontSize: 11, color: "#3b3b3b", marginTop: 4 }}>Todos los datos son simulados. Conecta APIs reales en Integraciones.</p>
            </div>
          </div>
        </div>

        <Section title="Integraciones" icon={Link2}>
          <Row label="Meta Business API" desc="Facebook & Instagram Ads">
            <button style={{ fontSize: 12, background: "#0d0d0d", border: "1px solid #333", color: "#888", borderRadius: 8, padding: "7px 14px", cursor: "pointer" }}>
              Conectar
            </button>
          </Row>
          <div style={{ height: 1, background: "#1a1a1a" }} />
          <Row label="Google Analytics 4" desc="Datos de tráfico y conversiones">
            <button style={{ fontSize: 12, background: "#0d0d0d", border: "1px solid #333", color: "#888", borderRadius: 8, padding: "7px 14px", cursor: "pointer" }}>
              Conectar
            </button>
          </Row>
          <div style={{ height: 1, background: "#1a1a1a" }} />
          <Row label="Shopify / eCommerce" desc="Datos de ventas y productos">
            <button style={{ fontSize: 12, background: "#0d0d0d", border: "1px solid #333", color: "#888", borderRadius: 8, padding: "7px 14px", cursor: "pointer" }}>
              Conectar
            </button>
          </Row>
          <div style={{ height: 1, background: "#1a1a1a" }} />
          <Row label="Slack Notifications" desc="Alertas en tiempo real">
            <span style={{ fontSize: 12, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(34,197,94,0.2)" }}>
              Conectado
            </span>
          </Row>
        </Section>

        <Section title="Equipo" icon={Users}>
          <Row label="Diego Sucrovich" desc="Admin · diego.sucro@gmail.com">
            <span style={{ fontSize: 11, color: "#555", background: "#1a1a1a", padding: "4px 10px", borderRadius: 6 }}>Admin</span>
          </Row>
          <div style={{ height: 1, background: "#1a1a1a" }} />
          <Row label="Invitar miembro" desc="Agrega colaboradores al workspace">
            <button style={{ fontSize: 12, background: "#fff", border: "none", color: "#000", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 600 }}>
              Invitar
            </button>
          </Row>
        </Section>

        <Section title="Notificaciones" icon={Bell}>
          <Row label="Alertas de presupuesto" desc="Cuando una campaña llega al 90%">
            <Toggle on={true} />
          </Row>
          <div style={{ height: 1, background: "#1a1a1a" }} />
          <Row label="Reporte semanal" desc="Resumen automático cada lunes 8am">
            <Toggle on={false} />
          </Row>
          <div style={{ height: 1, background: "#1a1a1a" }} />
          <Row label="Alertas de ROAS" desc="Cuando cae por debajo del benchmark">
            <Toggle on={true} />
          </Row>
        </Section>

        <Section title="Preferencias" icon={Palette}>
          <Row label="Zona Horaria" desc="Para reportes y calendario">
            <select style={{ background: "#0d0d0d", border: "1px solid #222", borderRadius: 8, padding: "8px 12px", color: "#ccc", fontSize: 13, outline: "none" }}>
              <option>América/Mexico_City (UTC-6)</option>
              <option>América/New_York (UTC-5)</option>
            </select>
          </Row>
          <div style={{ height: 1, background: "#1a1a1a" }} />
          <Row label="Moneda" desc="Para métricas de ventas">
            <select style={{ background: "#0d0d0d", border: "1px solid #222", borderRadius: 8, padding: "8px 12px", color: "#ccc", fontSize: 13, outline: "none" }}>
              <option>MXN — Peso Mexicano</option>
              <option>USD — Dólar Americano</option>
            </select>
          </Row>
        </Section>

        <Section title="Datos" icon={Database}>
          <Row label="Frecuencia de actualización" desc="¿Cada cuánto se refrescan los datos?">
            <select style={{ background: "#0d0d0d", border: "1px solid #222", borderRadius: 8, padding: "8px 12px", color: "#ccc", fontSize: 13, outline: "none" }}>
              <option>Cada 1 hora</option>
              <option>Cada 4 horas</option>
              <option>Diario</option>
            </select>
          </Row>
          <div style={{ height: 1, background: "#1a1a1a" }} />
          <Row label="Exportar datos" desc="Descarga todos los reportes en CSV">
            <button style={{ fontSize: 12, background: "#0d0d0d", border: "1px solid #333", color: "#888", borderRadius: 8, padding: "7px 14px", cursor: "pointer" }}>
              Exportar CSV
            </button>
          </Row>
        </Section>

        <Section title="Seguridad" icon={Shield}>
          <Row label="Autenticación de 2 factores" desc="Recomendado para cuentas de admin">
            <Toggle on={false} />
          </Row>
          <div style={{ height: 1, background: "#1a1a1a" }} />
          <Row label="Sesión activa" desc="Último acceso: hoy, 10:24 AM">
            <button style={{ fontSize: 12, background: "#0d0d0d", border: "1px solid #333", color: "#ef4444", borderRadius: 8, padding: "7px 14px", cursor: "pointer" }}>
              Cerrar Sesión
            </button>
          </Row>
        </Section>

      </div>
    </div>
  );
}
