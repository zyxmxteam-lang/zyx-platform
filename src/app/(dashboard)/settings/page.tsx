"use client";

import Header from "@/components/Header";
import { ZYXLogoFull } from "@/components/ZYXLogo";
import { useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Link2, Shield, Bell, Palette, Database, Users, Loader2 } from "lucide-react";

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

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        background: on ? "#22c55e" : "#222",
        cursor: "pointer",
        position: "relative",
        border: `1px solid ${on ? "#22c55e" : "#333"}`,
        transition: "background 0.2s, border-color 0.2s",
        flexShrink: 0,
      }}
    >
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: "white", position: "absolute", top: 2, left: on ? 20 : 2, transition: "left 0.2s" }} />
    </div>
  );
}

const INTEGRATIONS = [
  { key: "meta", label: "Meta Business API", desc: "Facebook & Instagram Ads" },
  { key: "ga4", label: "Google Analytics 4", desc: "Datos de tráfico y conversiones" },
  { key: "shopify", label: "Shopify / eCommerce", desc: "Datos de ventas y productos" },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<Record<string, boolean>>({ slack: true });

  const [notifToggles, setNotifToggles] = useState({
    presupuesto: true,
    roas: true,
    investigacion: true,
    pausa: false,
    reporte: false,
  });

  const [securityToggles, setSecurityToggles] = useState({ twofa: false });

  const [timezone, setTimezone] = useState("mx");
  const [currency, setCurrency] = useState("mxn");
  const [refreshRate, setRefreshRate] = useState("1h");

  const toggleNotif = (key: keyof typeof notifToggles) => {
    setNotifToggles(prev => {
      const next = { ...prev, [key]: !prev[key] };
      toast(next[key] ? "Notificación activada" : "Notificación desactivada", "info");
      return next;
    });
  };

  const handleConnect = async (key: string, label: string) => {
    if (connected[key]) {
      toast(`${label} ya está conectado`, "info");
      return;
    }
    setConnecting(key);
    await new Promise(r => setTimeout(r, 1400));
    setConnecting(null);
    setConnected(prev => ({ ...prev, [key]: true }));
    toast(`${label} conectado exitosamente`, "success");
  };

  const handleExportCSV = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 900));
    setExporting(false);

    const csv = [
      "Campaña,Inversión,Ingresos,ROAS,Conversiones",
      "Retargeting LAL MX,$12450,$63900,5.1x,347",
      "Prospecting Frío FB,$8200,$28700,3.5x,198",
      "Instagram Stories DPA,$5800,$17980,3.1x,142",
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zyx-reportes.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast("CSV exportado exitosamente", "success");
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleInviteRedirect = () => {
    router.push("/team");
  };

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
          {INTEGRATIONS.map(({ key, label, desc }, i) => (
            <div key={key}>
              {i > 0 && <div style={{ height: 1, background: "#1a1a1a", margin: "0 0 16px" }} />}
              <Row label={label} desc={desc}>
                {connected[key] ? (
                  <span style={{ fontSize: 12, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(34,197,94,0.2)" }}>
                    Conectado
                  </span>
                ) : (
                  <button
                    onClick={() => handleConnect(key, label)}
                    disabled={connecting === key}
                    style={{ fontSize: 12, background: "#0d0d0d", border: "1px solid #333", color: connecting === key ? "#555" : "#888", borderRadius: 8, padding: "7px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    {connecting === key && <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />}
                    {connecting === key ? "Conectando..." : "Conectar"}
                  </button>
                )}
              </Row>
            </div>
          ))}
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
            <button
              onClick={handleInviteRedirect}
              style={{ fontSize: 12, background: "#fff", border: "none", color: "#000", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 600 }}
            >
              Invitar →
            </button>
          </Row>
        </Section>

        <Section title="Notificaciones" icon={Bell}>
          <Row label="Alertas de presupuesto" desc="Cuando una campaña llega al 90%">
            <Toggle on={notifToggles.presupuesto} onToggle={() => toggleNotif("presupuesto")} />
          </Row>
          <div style={{ height: 1, background: "#1a1a1a" }} />
          <Row label="Reporte semanal" desc="Resumen automático cada lunes 8am">
            <Toggle on={notifToggles.reporte} onToggle={() => toggleNotif("reporte")} />
          </Row>
          <div style={{ height: 1, background: "#1a1a1a" }} />
          <Row label="Alertas de ROAS" desc="Cuando cae por debajo del benchmark">
            <Toggle on={notifToggles.roas} onToggle={() => toggleNotif("roas")} />
          </Row>
        </Section>

        <Section title="Preferencias" icon={Palette}>
          <Row label="Zona Horaria" desc="Para reportes y calendario">
            <select
              value={timezone}
              onChange={e => { setTimezone(e.target.value); toast("Zona horaria actualizada", "success"); }}
              style={{ background: "#0d0d0d", border: "1px solid #222", borderRadius: 8, padding: "8px 12px", color: "#ccc", fontSize: 13, outline: "none" }}
            >
              <option value="mx">América/Mexico_City (UTC-6)</option>
              <option value="ny">América/New_York (UTC-5)</option>
              <option value="la">América/Los_Angeles (UTC-8)</option>
            </select>
          </Row>
          <div style={{ height: 1, background: "#1a1a1a" }} />
          <Row label="Moneda" desc="Para métricas de ventas">
            <select
              value={currency}
              onChange={e => { setCurrency(e.target.value); toast("Moneda actualizada", "success"); }}
              style={{ background: "#0d0d0d", border: "1px solid #222", borderRadius: 8, padding: "8px 12px", color: "#ccc", fontSize: 13, outline: "none" }}
            >
              <option value="mxn">MXN — Peso Mexicano</option>
              <option value="usd">USD — Dólar Americano</option>
            </select>
          </Row>
        </Section>

        <Section title="Datos" icon={Database}>
          <Row label="Frecuencia de actualización" desc="¿Cada cuánto se refrescan los datos?">
            <select
              value={refreshRate}
              onChange={e => { setRefreshRate(e.target.value); toast("Frecuencia de actualización guardada", "success"); }}
              style={{ background: "#0d0d0d", border: "1px solid #222", borderRadius: 8, padding: "8px 12px", color: "#ccc", fontSize: 13, outline: "none" }}
            >
              <option value="1h">Cada 1 hora</option>
              <option value="4h">Cada 4 horas</option>
              <option value="daily">Diario</option>
            </select>
          </Row>
          <div style={{ height: 1, background: "#1a1a1a" }} />
          <Row label="Exportar datos" desc="Descarga todos los reportes en CSV">
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              style={{ fontSize: 12, background: "#0d0d0d", border: "1px solid #333", color: exporting ? "#555" : "#888", borderRadius: 8, padding: "7px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              {exporting && <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />}
              {exporting ? "Exportando..." : "Exportar CSV"}
            </button>
          </Row>
        </Section>

        <Section title="Seguridad" icon={Shield}>
          <Row label="Autenticación de 2 factores" desc="Recomendado para cuentas de admin">
            <Toggle
              on={securityToggles.twofa}
              onToggle={() => {
                setSecurityToggles(prev => ({ ...prev, twofa: !prev.twofa }));
                toast(!securityToggles.twofa ? "2FA activado" : "2FA desactivado", "info");
              }}
            />
          </Row>
          <div style={{ height: 1, background: "#1a1a1a" }} />
          <Row label="Sesión activa" desc={`Último acceso: hoy, ${new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`}>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              style={{ fontSize: 12, background: "#0d0d0d", border: "1px solid rgba(239,68,68,0.3)", color: loggingOut ? "#555" : "#ef4444", borderRadius: 8, padding: "7px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              {loggingOut && <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />}
              {loggingOut ? "Cerrando..." : "Cerrar Sesión"}
            </button>
          </Row>
        </Section>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
