"use client";

import Header from "@/components/Header";
import { researchItems } from "@/lib/data";
import { useState } from "react";
import { Search, Tag, Calendar, User, ChevronRight, Plus, BookOpen, Filter } from "lucide-react";

const priorityColors: Record<string, string> = {
  alta: "#ef4444",
  media: "#f59e0b",
  baja: "#22c55e",
};

const categoryColors: Record<string, string> = {
  "Competencia": "#3b82f6",
  "Audiencia": "#a855f7",
  "Optimización": "#22c55e",
  "Creativos": "#f59e0b",
  "SEO/SEM": "#06b6d4",
  "Industria": "#6366f1",
};

export default function ResearchPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [selected, setSelected] = useState<string | null>(null);

  const categories = ["Todos", ...Array.from(new Set(researchItems.map(r => r.category)))];

  const filtered = researchItems.filter(r => {
    const matchSearch = search === "" ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.summary.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === "Todos" || r.category === activeCategory;
    return matchSearch && matchCat;
  });

  const selectedItem = researchItems.find(r => r.id === selected);

  return (
    <div style={{ padding: "0 0 40px" }}>
      <Header
        title="Research Hub"
        subtitle="Base de conocimiento, análisis e investigación estratégica"
      />

      <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Stats Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "#1c1c1c", borderRadius: 12, overflow: "hidden", border: "1px solid #1c1c1c" }}>
          {[
            { label: "Total Reports", value: researchItems.length },
            { label: "Alta Prioridad", value: researchItems.filter(r => r.priority === "alta").length, color: "#ef4444" },
            { label: "Esta Semana", value: 2 },
            { label: "Categorías", value: categories.length - 1 },
          ].map((s, i) => (
            <div key={i} style={{ background: "#111", padding: "16px 20px" }}>
              <p style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{s.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: s.color ?? "#fff" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#111", border: "1px solid #222", borderRadius: 10, padding: "10px 16px" }}>
            <Search size={15} color="#444" />
            <input
              placeholder="Buscar en research... (título, resumen, etiquetas)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: "transparent", border: "none", outline: "none", color: "#ccc", fontSize: 13.5, width: "100%" }}
            />
          </div>
          <button
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: 10,
              padding: "10px 16px",
              color: "#555",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <Filter size={14} />
            Filtros
          </button>
          <button
            style={{
              background: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 18px",
              color: "#000",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Plus size={14} />
            Nuevo Report
          </button>
        </div>

        {/* Category Tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? "#fff" : "#111",
                color: activeCategory === cat ? "#000" : "#666",
                border: `1px solid ${activeCategory === cat ? "#fff" : "#222"}`,
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 12.5,
                cursor: "pointer",
                fontWeight: activeCategory === cat ? 600 : 400,
                transition: "all 0.15s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1.2fr" : "1fr", gap: 20 }}>
          {/* List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#444" }}>
                <BookOpen size={32} color="#333" style={{ margin: "0 auto 12px" }} />
                <p>No se encontraron resultados para &ldquo;{search}&rdquo;</p>
              </div>
            )}
            {filtered.map(item => (
              <div
                key={item.id}
                onClick={() => setSelected(item.id === selected ? null : item.id)}
                className="card-hover"
                style={{
                  background: selected === item.id ? "rgba(255,255,255,0.05)" : "#111",
                  border: `1px solid ${selected === item.id ? "#333" : "#1c1c1c"}`,
                  borderRadius: 12,
                  padding: "18px 20px",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 5,
                          background: `${categoryColors[item.category] ?? "#555"}15`,
                          color: categoryColors[item.category] ?? "#888",
                          border: `1px solid ${categoryColors[item.category] ?? "#555"}25`,
                        }}
                      >
                        {item.category}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 5,
                          background: `${priorityColors[item.priority]}15`,
                          color: priorityColors[item.priority],
                        }}
                      >
                        {item.priority.toUpperCase()}
                      </span>
                    </div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "#e0e0e0", lineHeight: 1.3 }}>{item.title}</h4>
                  </div>
                  <ChevronRight size={16} color="#333" style={{ flexShrink: 0, marginLeft: 8, transform: selected === item.id ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                </div>
                <p style={{ fontSize: 12.5, color: "#666", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {item.summary}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#444" }}>
                    <Calendar size={11} />
                    {item.date}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#444" }}>
                    <User size={11} />
                    {item.author}
                  </span>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {item.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 10.5, color: "#444", background: "#1a1a1a", padding: "2px 7px", borderRadius: 4, border: "1px solid #222" }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          {selected && selectedItem && (
            <div
              className="fade-in"
              style={{
                background: "#111",
                border: "1px solid #1c1c1c",
                borderRadius: 12,
                padding: "24px",
                position: "sticky",
                top: 20,
                alignSelf: "flex-start",
                maxHeight: "calc(100vh - 160px)",
                overflowY: "auto",
              }}
            >
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: `${categoryColors[selectedItem.category]}15`, color: categoryColors[selectedItem.category], border: `1px solid ${categoryColors[selectedItem.category]}25` }}>
                    {selectedItem.category}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: `${priorityColors[selectedItem.priority]}15`, color: priorityColors[selectedItem.priority] }}>
                    Prioridad {selectedItem.priority}
                  </span>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 8 }}>
                  {selectedItem.title}
                </h2>
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ fontSize: 12, color: "#555", display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={12} /> {selectedItem.date}
                  </span>
                  <span style={{ fontSize: 12, color: "#555", display: "flex", alignItems: "center", gap: 4 }}>
                    <User size={12} /> {selectedItem.author}
                  </span>
                </div>
              </div>

              <div style={{ height: 1, background: "#1c1c1c", margin: "16px 0" }} />

              <div>
                <h4 style={{ fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Resumen Ejecutivo</h4>
                <p style={{ fontSize: 14, color: "#ccc", lineHeight: 1.75 }}>
                  {selectedItem.summary}
                </p>
              </div>

              <div style={{ height: 1, background: "#1c1c1c", margin: "20px 0" }} />

              <div>
                <h4 style={{ fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Etiquetas</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selectedItem.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 12, color: "#888", background: "#1a1a1a", padding: "4px 10px", borderRadius: 6, border: "1px solid #222", display: "flex", alignItems: "center", gap: 4 }}>
                      <Tag size={11} /> {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ height: 1, background: "#1c1c1c", margin: "20px 0" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button style={{ background: "#fff", color: "#000", border: "none", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Ver Reporte Completo
                </button>
                <button style={{ background: "#1a1a1a", color: "#ccc", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 16px", fontSize: 13, cursor: "pointer" }}>
                  Exportar PDF
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
