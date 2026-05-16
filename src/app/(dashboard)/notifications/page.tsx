"use client";

import Header from "@/components/Header";
import { notifications as initialNotifications } from "@/lib/data";
import { useToast } from "@/components/Toast";
import { useState } from "react";
import { CheckCircle, AlertTriangle, Info, XCircle, Check, Bell } from "lucide-react";

const icons: Record<string, React.ReactNode> = {
  success: <CheckCircle size={18} color="#22c55e" />,
  warning: <AlertTriangle size={18} color="#f59e0b" />,
  alert: <XCircle size={18} color="#ef4444" />,
  info: <Info size={18} color="#3b82f6" />,
};

const bgColors: Record<string, string> = {
  success: "rgba(34,197,94,0.06)",
  warning: "rgba(245,158,11,0.06)",
  alert: "rgba(239,68,68,0.06)",
  info: "rgba(59,130,246,0.06)",
};

const borderColors: Record<string, string> = {
  success: "rgba(34,197,94,0.15)",
  warning: "rgba(245,158,11,0.15)",
  alert: "rgba(239,68,68,0.15)",
  info: "rgba(59,130,246,0.15)",
};

interface Notification {
  id: string;
  message: string;
  type: string;
  time: string;
  read: boolean;
}

const ALERT_CONFIGS = [
  { key: "presupuesto", label: "Alerta cuando presupuesto llegue al 90%", defaultEnabled: true },
  { key: "roas", label: "ROAS cae por debajo del benchmark", defaultEnabled: true },
  { key: "investigacion", label: "Nueva investigación disponible", defaultEnabled: true },
  { key: "pausa", label: "Campaña pausada automáticamente", defaultEnabled: false },
  { key: "reporte", label: "Reporte semanal cada lunes", defaultEnabled: false },
];

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifications as Notification[]);
  const [alertEnabled, setAlertEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(ALERT_CONFIGS.map(c => [c.key, c.defaultEnabled]))
  );

  const unread = notifs.filter(n => !n.read);
  const read = notifs.filter(n => n.read);

  const markOne = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    toast("Notificación marcada como leída", "success");
  };

  const markAll = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    toast("Todas las notificaciones marcadas como leídas", "success");
  };

  const toggleAlert = (key: string) => {
    setAlertEnabled(prev => {
      const next = { ...prev, [key]: !prev[key] };
      toast(next[key] ? "Alerta activada" : "Alerta desactivada", "info");
      return next;
    });
  };

  return (
    <div style={{ padding: "0 0 40px" }}>
      <Header
        title="Alertas & Notificaciones"
        subtitle={`${unread.length} alertas sin leer`}
      />

      <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 760 }}>

        {/* Unread */}
        {unread.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>
                Sin Leer ({unread.length})
              </h3>
              <button
                onClick={markAll}
                style={{ fontSize: 12, color: "#3b82f6", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
              >
                <Check size={13} /> Marcar todo leído
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {unread.map(n => (
                <div
                  key={n.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "16px 18px",
                    background: bgColors[n.type],
                    border: `1px solid ${borderColors[n.type]}`,
                    borderRadius: 12,
                  }}
                >
                  <span style={{ flexShrink: 0, marginTop: 2 }}>{icons[n.type]}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, color: "#e0e0e0", lineHeight: 1.5, fontWeight: 500 }}>{n.message}</p>
                    <p style={{ fontSize: 11.5, color: "#555", marginTop: 4 }}>{n.time}</p>
                  </div>
                  <button
                    onClick={() => markOne(n.id)}
                    title="Marcar como leído"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #2a2a2a", borderRadius: 6, cursor: "pointer", color: "#666", flexShrink: 0, display: "flex", padding: "4px 6px" }}
                  >
                    <Check size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {unread.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 20px", background: "#111", border: "1px solid #1c1c1c", borderRadius: 12 }}>
            <CheckCircle size={32} color="#22c55e" style={{ margin: "0 auto 10px" }} />
            <p style={{ fontSize: 14, color: "#555" }}>Todo al día — sin notificaciones pendientes</p>
          </div>
        )}

        {/* All read */}
        {read.length > 0 && (
          <div>
            <h3 style={{ fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, marginBottom: 12 }}>
              Historial
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {read.map(n => (
                <div
                  key={n.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "14px 18px",
                    background: "#0e0e0e",
                    border: "1px solid #1a1a1a",
                    borderRadius: 10,
                    opacity: 0.6,
                  }}
                >
                  <span style={{ flexShrink: 0, marginTop: 2 }}>{icons[n.type]}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13.5, color: "#888", lineHeight: 1.5 }}>{n.message}</p>
                    <p style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Config */}
        <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Bell size={15} color="#555" />
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "#888" }}>Configuración de Alertas</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ALERT_CONFIGS.map(cfg => (
              <div key={cfg.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13.5, color: "#888" }}>{cfg.label}</span>
                <div
                  onClick={() => toggleAlert(cfg.key)}
                  style={{
                    width: 40,
                    height: 22,
                    borderRadius: 11,
                    background: alertEnabled[cfg.key] ? "#22c55e" : "#222",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 0.2s",
                    border: `1px solid ${alertEnabled[cfg.key] ? "#22c55e" : "#333"}`,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "white",
                      position: "absolute",
                      top: 2,
                      left: alertEnabled[cfg.key] ? 20 : 2,
                      transition: "left 0.2s",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
