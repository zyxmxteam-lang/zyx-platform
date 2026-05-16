"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ZYXLogoFull } from "@/components/ZYXLogo";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Error al iniciar sesión");
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
            <ZYXLogoFull size={44} />
          </div>
          <p style={{ color: "#3a3a3a", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Plataforma Interna
          </p>
        </div>

        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 18, padding: "38px 34px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 5, letterSpacing: "-0.02em" }}>
            Iniciar Sesión
          </h1>
          <p style={{ fontSize: 13, color: "#4a4a4a", marginBottom: 28 }}>Accede a tu workspace de ZYX</p>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 9, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 10, padding: "11px 14px", marginBottom: 22 }}>
              <AlertCircle size={14} color="#ef4444" />
              <span style={{ fontSize: 13, color: "#ef4444" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 7 }}>Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="tu@empresa.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: "100%", background: "#0c0c0c", border: "1px solid #222", borderRadius: 10, padding: "11px 14px", color: "#e0e0e0", fontSize: 14, outline: "none" }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 7 }}>Contraseña</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: "100%", background: "#0c0c0c", border: "1px solid #222", borderRadius: 10, padding: "11px 44px 11px 14px", color: "#e0e0e0", fontSize: 14, outline: "none" }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#444", display: "flex" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", background: loading ? "#1e1e1e" : "#ffffff", color: loading ? "#555" : "#000000", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 6 }}
            >
              {loading ? "Entrando..." : <><span>Entrar</span><ArrowRight size={15} /></>}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 12.5, color: "#333", marginTop: 24 }}>
            ¿Nuevo colaborador?{" "}
            <Link href="/register" style={{ color: "#666", textDecoration: "none", fontWeight: 500 }}>Solicitar acceso</Link>
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: 10.5, color: "#222", marginTop: 20 }}>Plataforma privada · Solo uso interno ZYX</p>
      </div>
    </div>
  );
}
