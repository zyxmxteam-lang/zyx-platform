"use client";

import Header from "@/components/Header";
import { useState } from "react";
import { UserPlus, Mail, X, CheckCircle, Crown, Shield, User, MoreHorizontal, Trash2 } from "lucide-react";

type Role = "admin" | "member" | "viewer";

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  status: "active" | "invited" | "inactive";
  joinedAt: string;
  initials: string;
  color: string;
}

const ROLE_CONFIG: Record<Role, { label: string; icon: React.ReactNode; color: string; desc: string }> = {
  admin: { label: "Admin", icon: <Crown size={12} />, color: "#f59e0b", desc: "Acceso total · puede invitar y administrar" },
  member: { label: "Miembro", icon: <User size={12} />, color: "#3b82f6", desc: "Acceso completo a contenido" },
  viewer: { label: "Observador", icon: <Shield size={12} />, color: "#555", desc: "Solo lectura · sin edición" },
};

const INITIAL_MEMBERS: Member[] = [
  { id: "m1", name: "Diego Sucrovich", email: "diego.sucro@gmail.com", role: "admin", department: "Marketing", status: "active", joinedAt: "2025-05-01", initials: "DS", color: "#3b82f6" },
  { id: "m2", name: "Ana García", email: "ana.garcia@zyx.mx", role: "member", department: "Diseño", status: "active", joinedAt: "2025-05-05", initials: "AG", color: "#a855f7" },
  { id: "m3", name: "Carlos López", email: "c.lopez@zyx.mx", role: "member", department: "Ventas", status: "invited", joinedAt: "2025-05-12", initials: "CL", color: "#22c55e" },
];

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("member");
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sendError, setSendError] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setSending(true);
    setSendError("");

    const res = await fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail, role: inviteRole, invitedBy: "Diego Sucrovich" }),
    });

    const data = await res.json();

    if (!res.ok) {
      setSendError(data.error ?? "Error al enviar el email");
      setSending(false);
      return;
    }

    const newMember: Member = {
      id: `m${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "invited",
      joinedAt: new Date().toISOString().split("T")[0],
      initials: inviteEmail.slice(0, 2).toUpperCase(),
      color: "#555",
    };
    setMembers(prev => [...prev, newMember]);
    setSending(false);
    setSentSuccess(true);
    setInviteEmail("");
    setTimeout(() => { setSentSuccess(false); setShowInvite(false); }, 3000);
  };

  const removeM = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    setActiveMenu(null);
  };

  const changeRole = (id: string, role: Role) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
    setActiveMenu(null);
  };

  const active = members.filter(m => m.status === "active");
  const invited = members.filter(m => m.status === "invited");

  return (
    <div style={{ padding: "0 0 40px" }}>
      <Header title="Equipo" subtitle={`${active.length} miembros activos · ${invited.length} invitaciones pendientes`} />

      <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 720 }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            { label: "Miembros Activos", value: active.length, color: "#22c55e" },
            { label: "Invitaciones Pendientes", value: invited.length, color: "#f59e0b" },
            { label: "Roles de Admin", value: members.filter(m => m.role === "admin").length, color: "#a855f7" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, padding: "16px 18px" }}>
              <p style={{ fontSize: 11, color: "#555", marginBottom: 5 }}>{s.label}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Invite Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => setShowInvite(!showInvite)}
            style={{ background: "#fff", color: "#000", border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            <UserPlus size={14} /> Invitar Miembro
          </button>
        </div>

        {/* Invite Form */}
        {showInvite && (
          <div className="fade-in" style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: 14, padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Invitar por Email</h3>
              <button onClick={() => setShowInvite(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#444" }}>
                <X size={16} />
              </button>
            </div>

            {sentSuccess ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 10 }}>
                <CheckCircle size={18} color="#22c55e" />
                <div>
                  <p style={{ fontSize: 13.5, color: "#22c55e", fontWeight: 600 }}>¡Invitación enviada!</p>
                  <p style={{ fontSize: 12.5, color: "#22c55e", opacity: 0.7, marginTop: 2 }}>El email llegará a {inviteEmail || "la dirección indicada"} en unos momentos.</p>
                </div>
              </div>
            ) : (
              <>{sendError && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
                  <span style={{ fontSize: 13, color: "#ef4444" }}>⚠ {sendError}</span>
                </div>
              )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 14 }}>
                  <div style={{ position: "relative" }}>
                    <Mail size={14} color="#444" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="email"
                      placeholder="email@empresa.com"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleInvite()}
                      style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: 8, padding: "10px 14px 10px 34px", color: "#ccc", fontSize: 13.5, outline: "none" }}
                    />
                  </div>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as Role)}
                    style={{ background: "#0d0d0d", border: "1px solid #222", borderRadius: 8, padding: "10px 12px", color: "#ccc", fontSize: 13, outline: "none" }}
                  >
                    <option value="member">Miembro</option>
                    <option value="viewer">Observador</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Role descriptions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                  {(Object.keys(ROLE_CONFIG) as Role[]).map(r => (
                    <div
                      key={r}
                      onClick={() => setInviteRole(r)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 12px",
                        borderRadius: 8,
                        cursor: "pointer",
                        background: inviteRole === r ? `${ROLE_CONFIG[r].color}10` : "transparent",
                        border: `1px solid ${inviteRole === r ? ROLE_CONFIG[r].color + "30" : "transparent"}`,
                      }}
                    >
                      <span style={{ color: ROLE_CONFIG[r].color, display: "flex" }}>{ROLE_CONFIG[r].icon}</span>
                      <span style={{ fontSize: 13, color: inviteRole === r ? "#ddd" : "#666", fontWeight: inviteRole === r ? 500 : 400 }}>
                        <strong>{ROLE_CONFIG[r].label}</strong> — {ROLE_CONFIG[r].desc}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleInvite}
                  disabled={sending || !inviteEmail.trim()}
                  style={{ background: "#fff", color: "#000", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Mail size={14} /> {sending ? "Enviando..." : "Enviar Invitación"}
                </button>
              </>
            )}
          </div>
        )}

        {/* Members List */}
        <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid #1c1c1c", display: "flex", alignItems: "center", gap: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Miembros del Equipo</h3>
            <span style={{ fontSize: 11, color: "#444", background: "#1a1a1a", borderRadius: 10, padding: "1px 8px" }}>{members.length}</span>
          </div>

          <div>
            {members.map((m, i) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 22px",
                  borderTop: i > 0 ? "1px solid #171717" : "none",
                  position: "relative",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: `${m.color}20`,
                    border: `1.5px solid ${m.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: m.color,
                    flexShrink: 0,
                  }}
                >
                  {m.initials}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#e0e0e0" }}>{m.name}</p>
                    {m.status === "invited" && (
                      <span style={{ fontSize: 10.5, color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "2px 7px", borderRadius: 4, border: "1px solid rgba(245,158,11,0.2)" }}>
                        Invitado
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: "#555", marginTop: 1 }}>{m.email}</p>
                </div>

                {/* Department */}
                {m.department && (
                  <span style={{ fontSize: 12, color: "#444", background: "#161616", padding: "4px 10px", borderRadius: 6, border: "1px solid #1e1e1e" }}>
                    {m.department}
                  </span>
                )}

                {/* Role */}
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: ROLE_CONFIG[m.role].color, background: `${ROLE_CONFIG[m.role].color}10`, padding: "4px 10px", borderRadius: 6, border: `1px solid ${ROLE_CONFIG[m.role].color}25`, fontWeight: 500, whiteSpace: "nowrap" }}>
                  {ROLE_CONFIG[m.role].icon} {ROLE_CONFIG[m.role].label}
                </span>

                {/* Actions */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setActiveMenu(activeMenu === m.id ? null : m.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#444", display: "flex", padding: 4 }}
                  >
                    <MoreHorizontal size={15} />
                  </button>

                  {activeMenu === m.id && (
                    <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "6px", zIndex: 100, minWidth: 180 }}>
                      <p style={{ fontSize: 10.5, color: "#444", padding: "4px 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Cambiar rol</p>
                      {(Object.keys(ROLE_CONFIG) as Role[]).map(r => (
                        <button
                          key={r}
                          onClick={() => changeRole(m.id, r)}
                          style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 10px", background: m.role === r ? "rgba(255,255,255,0.05)" : "none", border: "none", cursor: "pointer", color: m.role === r ? "#fff" : "#888", fontSize: 13, borderRadius: 6, textAlign: "left" }}
                        >
                          <span style={{ color: ROLE_CONFIG[r].color }}>{ROLE_CONFIG[r].icon}</span>
                          {ROLE_CONFIG[r].label}
                        </button>
                      ))}
                      {m.id !== "m1" && (
                        <>
                          <div style={{ height: 1, background: "#222", margin: "4px 0" }} />
                          <button
                            onClick={() => removeM(m.id)}
                            style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 10px", background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13, borderRadius: 6, textAlign: "left" }}
                          >
                            <Trash2 size={12} /> Eliminar miembro
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions Overview */}
        <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid #1c1c1c" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Permisos por Rol</h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0d0d0d" }}>
                  <th style={{ padding: "10px 22px", textAlign: "left", fontSize: 11, color: "#555", fontWeight: 500 }}>Acción</th>
                  {(Object.keys(ROLE_CONFIG) as Role[]).map(r => (
                    <th key={r} style={{ padding: "10px 16px", textAlign: "center", fontSize: 11, color: ROLE_CONFIG[r].color, fontWeight: 600 }}>
                      {ROLE_CONFIG[r].label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Ver Dashboard", true, true, true],
                  ["Editar Campañas", true, true, false],
                  ["Gestionar Tareas", true, true, false],
                  ["Crear Documentos", true, true, false],
                  ["Invitar Miembros", true, false, false],
                  ["Gestionar Roles", true, false, false],
                  ["Configuración", true, false, false],
                ].map(([label, admin, member, viewer], i) => (
                  <tr key={i} style={{ borderTop: "1px solid #171717", background: i % 2 === 0 ? "#111" : "#0e0e0e" }}>
                    <td style={{ padding: "11px 22px", fontSize: 13, color: "#888" }}>{label as string}</td>
                    {[admin, member, viewer].map((has, j) => (
                      <td key={j} style={{ padding: "11px 16px", textAlign: "center" }}>
                        <span style={{ fontSize: 15, color: has ? "#22c55e" : "#333" }}>{has ? "✓" : "—"}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
