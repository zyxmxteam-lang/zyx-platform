"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ZYXLogoFull } from "@/components/ZYXLogo";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message === "Invalid login credentials" ? "Email o contraseña incorrectos" : error.message);
      setLoading(false);
      return;
    }
    router.push("/overview");
    router.refresh();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <ZYXLogoFull size={40} />
          </div>
          <p style={{ color: "#444", fontSize: 13, letterSpacing: "0.05em" }}>PLATAFORMA INTERNA</p>
        </div>
        <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 16, padding: "36px 32px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, letterSpacing: "-0.02em" }}>Iniciar Sesión</h1>
          <p style={{ fontSize: 13, color: "#555", marginBottom: 28 }}>Accede a tu workspace de ZYX</p>
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 20 }}>
              <AlertCircle size={14} color="#ef4444" />
              <span style={{ fontSize: 13, color: "#ef4444" }}>{error}</span>
            </div>
          )}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12.5, color: "#666", display: "block", marginBottom: 6 }}>Email</label>
              <input type="email" required placeholder="tu@empresa.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: 10, padding: "11px 14px", color: "#e0e0e0", fontSize: 14, outline: "none" }} />
            </div>
            <div>
              <label style={{ fontSize: 12.5, color: "#666", display: "block", marginBottom: 6 }}>Contraseña</label>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: 10, padding: "11px 44px 11px 14px", color: "#e0e0e0", fontSize: 14, outline: "none" }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#444", display: "flex", alignItems: "center" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", background: loading ? "#333" : "#ffffff", color: loading ? "#888" : "#000000", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
              {loading ? "Entrando..." : <><span>Entrar</span><ArrowRight size={15} /></>}
            </button>
          </form>
          <p style={{ textAlign: "center", fontSize: 13, color: "#444", marginTop: 24 }}>
            ¿No tienes cuenta?{" "}
            <Link href="/register" style={{ color: "#888", textDecoration: "none", fontWeight: 500 }}>Solicita acceso</Link>
          </p>
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "#2a2a2a", marginTop: 24 }}>Plataforma privada · Solo uso interno ZYX</p>
      </div>
    </div>
  );
}
