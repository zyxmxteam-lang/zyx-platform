"use client";

import Header from "@/components/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, FileText, Star, Clock, Trash2, MoreHorizontal } from "lucide-react";

interface Doc {
  id: string;
  title: string;
  emoji: string;
  content: string;
  tags: string[];
  updatedAt: string;
  createdBy: string;
  starred?: boolean;
}

const INITIAL_DOCS: Doc[] = [
  {
    id: "d1",
    title: "Estrategia de Marketing Q2 2025",
    emoji: "🎯",
    content: "# Estrategia de Marketing Q2 2025\n\n## Objetivos\n- Alcanzar $30k en ingresos mensuales\n- ROAS mínimo de 4x en todas las campañas\n- Reducir CPA a menos de $3.00\n\n## Canales Prioritarios\n1. **Meta Ads** — Budget: $6,000/mes\n2. **Email Marketing** — Automatización de flujos\n3. **Organic Social** — 3 posts/semana\n\n## KPIs de Seguimiento\n- ROAS semanal\n- CTR por creativo\n- CPA por audiencia",
    tags: ["estrategia", "q2", "meta"],
    updatedAt: "2025-05-14",
    createdBy: "DS",
    starred: true,
  },
  {
    id: "d2",
    title: "Brief de Creativos — Verano 2025",
    emoji: "🎨",
    content: "# Brief Creativos Verano 2025\n\n## Concepto Central\nVerano es libertad, aventura y autenticidad. Los creativos deben capturar momentos reales.\n\n## Formatos Requeridos\n- **Reels 9:16** (15s y 30s)\n- **Stories** (9:16, texto mínimo)\n- **Feed cuadrado** (1:1)\n\n## Mensajes Clave\n1. Hook en primeros 3 segundos\n2. Beneficio claro y directo\n3. CTA fuerte al final\n\n## Referencias Visuales\nTonos cálidos, saturación media-alta, personas reales.",
    tags: ["creativos", "verano", "brief"],
    updatedAt: "2025-05-12",
    createdBy: "DS",
    starred: false,
  },
  {
    id: "d3",
    title: "Playbook de Onboarding — Nuevos Clientes",
    emoji: "📋",
    content: "# Onboarding Nuevos Clientes\n\n## Semana 1\n- [ ] Kick-off call (60 min)\n- [ ] Acceso a Meta Business Manager\n- [ ] Auditoría de campañas existentes\n- [ ] Definición de objetivos y KPIs\n\n## Semana 2\n- [ ] Setup de pixel y eventos\n- [ ] Configuración de públicos\n- [ ] Lanzamiento de campañas test\n\n## Semana 3-4\n- [ ] Revisión de resultados\n- [ ] Optimización basada en datos\n- [ ] Reporte de primeras 4 semanas",
    tags: ["onboarding", "proceso", "cliente"],
    updatedAt: "2025-05-10",
    createdBy: "DS",
  },
  {
    id: "d4",
    title: "SOP — Análisis de Competencia",
    emoji: "🔍",
    content: "# SOP: Análisis de Competencia\n\n## Frecuencia\nQuincenal — cada primer y tercer lunes del mes.\n\n## Proceso\n1. Revisar Facebook Ad Library de top 5 competidores\n2. Documentar creativos nuevos y mensajes\n3. Analizar engagement en Instagram/Facebook\n4. Identificar gaps y oportunidades\n5. Actualizar documento de insights\n\n## Herramientas\n- Meta Ad Library\n- SimilarWeb\n- SEMrush\n- Sprout Social",
    tags: ["sop", "competencia", "proceso"],
    updatedAt: "2025-05-08",
    createdBy: "DS",
  },
];

export default function DocsPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<Doc[]>(INITIAL_DOCS);
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filtered = docs.filter(d =>
    search === "" ||
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.tags.some(t => t.includes(search.toLowerCase()))
  );

  const starred = filtered.filter(d => d.starred);
  const recent = filtered.filter(d => !d.starred);

  const createDoc = () => {
    const newDoc: Doc = {
      id: `d${Date.now()}`,
      title: "Sin título",
      emoji: "📄",
      content: "",
      tags: [],
      updatedAt: new Date().toISOString().split("T")[0],
      createdBy: "DS",
    };
    setDocs(prev => [newDoc, ...prev]);
    router.push(`/docs/${newDoc.id}`);
  };

  const toggleStar = (id: string) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, starred: !d.starred } : d));
  };

  const deleteDoc = (id: string) => {
    setDocs(prev => prev.filter(d => d.id !== id));
    setActiveMenu(null);
  };

  const DocCard = ({ doc }: { doc: Doc }) => (
    <div
      style={{
        background: "#111",
        border: "1px solid #1c1c1c",
        borderRadius: 12,
        padding: "18px 20px",
        cursor: "pointer",
        transition: "all 0.15s ease",
        position: "relative",
      }}
      className="card-hover"
      onClick={() => router.push(`/docs/${doc.id}`)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>{doc.emoji}</div>
          <h3 style={{ fontSize: 14.5, fontWeight: 600, color: "#e0e0e0", marginBottom: 8, lineHeight: 1.3 }}>
            {doc.title}
          </h3>
          <p style={{ fontSize: 12, color: "#444", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {doc.content.replace(/[#*\[\]-]/g, "").trim().slice(0, 100)}...
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {doc.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{ fontSize: 10.5, color: "#555", background: "#1a1a1a", padding: "2px 7px", borderRadius: 4, border: "1px solid #222" }}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#333", display: "flex", alignItems: "center", gap: 3 }}>
            <Clock size={10} /> {doc.updatedAt}
          </span>
          <button
            onClick={e => { e.stopPropagation(); toggleStar(doc.id); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: doc.starred ? "#f59e0b" : "#333", padding: 0, display: "flex" }}
          >
            <Star size={13} fill={doc.starred ? "#f59e0b" : "none"} />
          </button>
          <div style={{ position: "relative" }}>
            <button
              onClick={e => { e.stopPropagation(); setActiveMenu(activeMenu === doc.id ? null : doc.id); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#333", padding: 0, display: "flex" }}
            >
              <MoreHorizontal size={14} />
            </button>
            {activeMenu === doc.id && (
              <div style={{ position: "absolute", right: 0, bottom: "calc(100% + 4px)", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "4px", zIndex: 100, minWidth: 130 }}>
                <button
                  onClick={e => { e.stopPropagation(); deleteDoc(doc.id); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 10px", background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 12.5, borderRadius: 5 }}
                >
                  <Trash2 size={12} /> Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "0 0 40px" }}>
      <Header
        title="Documentos"
        subtitle="Base de conocimiento · Estrategias, SOPs y briefs"
      />

      <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Controls */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#111", border: "1px solid #222", borderRadius: 10, padding: "9px 14px" }}>
            <Search size={14} color="#444" />
            <input
              placeholder="Buscar documentos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: "transparent", border: "none", outline: "none", color: "#ccc", fontSize: 13.5, width: "100%" }}
            />
          </div>
          <button
            onClick={createDoc}
            style={{ background: "#fff", color: "#000", border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            <Plus size={14} /> Nuevo Documento
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { label: "Total docs", value: docs.length },
            { label: "Destacados", value: docs.filter(d => d.starred).length },
            { label: "Esta semana", value: 2 },
          ].map((s, i) => (
            <div key={i} style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 10, padding: "12px 18px", display: "flex", gap: 10, alignItems: "center" }}>
              <FileText size={15} color="#444" />
              <div>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{s.value}</p>
                <p style={{ fontSize: 11, color: "#555" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Starred */}
        {starred.length > 0 && (
          <div>
            <h3 style={{ fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Star size={12} color="#f59e0b" fill="#f59e0b" /> Destacados
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {starred.map(doc => <DocCard key={doc.id} doc={doc} />)}
            </div>
          </div>
        )}

        {/* All Docs */}
        <div>
          <h3 style={{ fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
            {starred.length > 0 ? "Otros documentos" : "Todos los documentos"}
          </h3>
          {recent.length === 0 && starred.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#333" }}>
              <FileText size={36} style={{ margin: "0 auto 12px" }} />
              <p style={{ marginBottom: 16 }}>No hay documentos aún</p>
              <button onClick={createDoc} style={{ background: "#fff", color: "#000", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Crear primer documento
              </button>
            </div>
          )}
          {recent.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {recent.map(doc => <DocCard key={doc.id} doc={doc} />)}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
