"use client";

import Header from "@/components/Header";
import { useState } from "react";
import { Camera, Save, CheckCircle } from "lucide-react";
import { ZYXLogoFull } from "@/components/ZYXLogo";

export default function ProfilePage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    fullName: "Diego Sucrovich",
    email: "diego.sucro@gmail.com",
    department: "Marketing",
    phone: "+52 55 1234 5678",
    bio: "Especialista en marketing digital y campañas de Meta Ads. Apasionado por los datos y la optimización de performance.",
    role: "Admin",
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputStyle = {
    width: "100%",
    background: "#0d0d0d",
    border: "1px solid #222",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#ccc",
    fontSize: 13.5,
    outline: "none",
    transition: "border-color 0.15s",
  };

  const initials = form.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={{ padding: "0 0 40px" }}>
      <Header title="Mi Perfil" subtitle="Gestiona tu información personal y preferencias" />

      <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 680 }}>

        {/* Avatar Section */}
        <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 16, padding: "28px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1a1a1a, #3a3a3a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#fff",
                  border: "2px solid #2a2a2a",
                }}
              >
                {initials}
              </div>
              <button
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Camera size={13} color="#000" />
              </button>
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{form.fullName}</h2>
              <p style={{ fontSize: 13, color: "#555", marginTop: 3 }}>{form.email}</p>
              <span
                style={{
                  display: "inline-block",
                  marginTop: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: "rgba(34,197,94,0.1)",
                  color: "#22c55e",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                {form.role}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 16, padding: "24px 28px" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, color: "#888" }}>Información Personal</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 6 }}>Nombre completo</label>
              <input style={inputStyle} value={form.fullName} onChange={handleChange("fullName")} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 6 }}>Email</label>
              <input style={{ ...inputStyle, color: "#444", cursor: "not-allowed" }} value={form.email} disabled />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 6 }}>Departamento</label>
              <input style={inputStyle} value={form.department} onChange={handleChange("department")} placeholder="Marketing, Ventas..." />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 6 }}>Teléfono</label>
              <input style={inputStyle} value={form.phone} onChange={handleChange("phone")} placeholder="+52 55 ..." />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 6 }}>Bio</label>
              <textarea
                style={{ ...inputStyle, minHeight: 90, resize: "vertical" as const }}
                value={form.bio}
                onChange={handleChange("bio")}
                placeholder="Cuéntanos un poco sobre ti..."
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 16, padding: "24px 28px" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, color: "#888" }}>Cambiar Contraseña</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 6 }}>Nueva contraseña</label>
              <input type="password" style={inputStyle} placeholder="••••••••" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 6 }}>Confirmar contraseña</label>
              <input type="password" style={inputStyle} placeholder="••••••••" />
            </div>
          </div>
          <button style={{ marginTop: 14, background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ccc", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
            Actualizar contraseña
          </button>
        </div>

        {/* Activity */}
        <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 16, padding: "24px 28px" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#888" }}>Actividad Reciente</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { action: "Editó documento", detail: "Estrategia Q2 2025", time: "hace 2h" },
              { action: "Actualizó tarea", detail: "Configurar retargeting LAL", time: "hace 4h" },
              { action: "Agregó item al roadmap", detail: "Expandir a TikTok Ads", time: "ayer" },
              { action: "Inició sesión", detail: "desde macOS Safari", time: "ayer" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #171717" }}>
                <div>
                  <span style={{ fontSize: 13, color: "#ccc" }}>{a.action}</span>
                  <span style={{ fontSize: 13, color: "#555" }}> — {a.detail}</span>
                </div>
                <span style={{ fontSize: 11.5, color: "#333" }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: saving ? "#333" : "#fff",
            color: saving ? "#888" : "#000",
            border: "none",
            borderRadius: 10,
            padding: "12px",
            fontSize: 14,
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {saved ? (
            <><CheckCircle size={15} color="#22c55e" /> Guardado</>
          ) : saving ? (
            "Guardando..."
          ) : (
            <><Save size={15} /> Guardar Cambios</>
          )}
        </button>

      </div>
    </div>
  );
}
