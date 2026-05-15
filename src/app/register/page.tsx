"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ZYXLogoFull } from "@/components/ZYXLogo";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError("Las contraseñas no coinciden"); return; }
    if (form.password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres"); return; }
    setLoading(true); setError("");
    const { error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.fullName } } });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true); setLoading(false);
  };

  const inputStyle = { width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: 10, padding: "11px 14px", color: "#e0e0e0", fontSize: 14, outline: "none" };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}><ZYXLogoFull size={40} /></div>
          <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 16, padding: "40px 32px" }}>
            <CheckCircle size={40} color="#22c55e" style={{ margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>¡Cuenta creada!</h2>
            <p style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6, marginBottom: 24 }}>Revisa tu email <strong style={{ color: "#ccc" }}>{form.email}</strong> para confirmar tu cuenta.</p>
            <Link href="/login" style={{ display: "block", background: "#fff", color: "#000", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Ir al Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><ZYXLogoFull size={40} /></div>
          <p style={{ color: "#444", fontSize: 13, letterSpacing: "0.05em" }}>CREAR CUENTA</p>
        </div>
        <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 16, padding: "36px 32px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Crear Cuenta</h1>
          <p style={{ fontSize: 13, color: "#555", marginBottom: 28 }}>Únete al workspace de ZYX</p>
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 20 }}>
              <AlertCircle size={14} color="#ef4444" />
              <span style={{ fontSize: 13, color: "#ef4444" }}>{error}</span>
            </div>
          )}
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><label style={{ fontSize: 12.5, color: "#666", display: "block", marginBottom: 6 }}>Nombre completo</label><input type="text" required placeholder="Diego Sucrovich" value={form.fullName} onChange={handleChange("fullName")} style={inputStyle} /></div>
            <div><label style={{ fontSize: 12.5, color: "#666", display: "block", marginBottom: 6 }}>Email</label><input type="email" required placeholder="tu@empresa.com" value={form.email} onChange={handleChange("email")} style={inputStyle} /></div>
            <div>
              <label style={{ fontSize: 12.5, color: "#666", display: "block", marginBottom: 6 }}>Contraseña</label>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} required placeholder="Mínimo 8 caracteres" value={form.password} onChange={handleChange("password")} style={{ ...inputStyle, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#444", display: "flex" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div><label style={{ fontSize: 12.5, color: "#666", display: "block", marginBottom: 6 }}>Confirmar contraseña</label><input type="password" required placeholder="••••••••" value={form.confirmPassword} onChange={handleChange("confirmPassword")} style={inputStyle} /></div>
            <button type="submit" disabled={loading} style={{ width: "100%", background: loading ? "#333" : "#fff", color: loading ? "#888" : "#000", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}>
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>
          <p style={{ textAlign: "center", fontSize: 13, color: "#444", marginTop: 24 }}>
            ¿Ya tienes cuenta? <Link href="/login" style={{ color: "#888", textDecoration: "none", fontWeight: 500 }}>Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
