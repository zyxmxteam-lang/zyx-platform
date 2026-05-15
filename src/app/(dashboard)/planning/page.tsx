"use client";

import Header from "@/components/Header";
import { useState } from "react";
import { Plus, X, ChevronDown, Target, Bug, Lightbulb, Star, Megaphone } from "lucide-react";

type ItemType = "feature" | "bug" | "milestone" | "idea" | "campaign";
type ItemStatus = "backlog" | "planned" | "in_progress" | "completed" | "cancelled";
type Priority = "low" | "medium" | "high";

interface PlanningItem {
  id: string;
  title: string;
  description?: string;
  type: ItemType;
  status: ItemStatus;
  priority: Priority;
  quarter: string;
  owner?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
}

const TYPE_CONFIG: Record<ItemType, { label: string; icon: React.ReactNode; color: string }> = {
  feature: { label: "Feature", icon: <Star size={12} />, color: "#3b82f6" },
  bug: { label: "Bug", icon: <Bug size={12} />, color: "#ef4444" },
  milestone: { label: "Hito", icon: <Target size={12} />, color: "#a855f7" },
  idea: { label: "Idea", icon: <Lightbulb size={12} />, color: "#f59e0b" },
  campaign: { label: "Campaña", icon: <Megaphone size={12} />, color: "#22c55e" },
};

const STATUS_CONFIG: Record<ItemStatus, { label: string; color: string }> = {
  backlog: { label: "Backlog", color: "#555" },
  planned: { label: "Planeado", color: "#3b82f6" },
  in_progress: { label: "En Progreso", color: "#f59e0b" },
  completed: { label: "Completado", color: "#22c55e" },
  cancelled: { label: "Cancelado", color: "#ef4444" },
};

const QUARTERS = ["Q2 2025", "Q3 2025", "Q4 2025", "Q1 2026"];

const INITIAL_ITEMS: PlanningItem[] = [
  { id: "p1", title: "Lanzar campaña de Verano", type: "campaign", status: "in_progress", priority: "high", quarter: "Q2 2025", description: "Campaña integral en Meta con presupuesto de $5k. Creativos en video corto.", owner: "DS", tags: ["meta", "verano"] },
  { id: "p2", title: "Optimizar embudo de conversión", type: "feature", status: "planned", priority: "high", quarter: "Q2 2025", description: "Reducir el drop del 98% en checkout. A/B test en landing page.", owner: "DS" },
  { id: "p3", title: "Alcanzar $30k de ingresos mensuales", type: "milestone", status: "planned", priority: "high", quarter: "Q2 2025", description: "Meta de ingresos para cierre de Q2." },
  { id: "p4", title: "Implementar email marketing automation", type: "feature", status: "backlog", priority: "medium", quarter: "Q3 2025", description: "Setup de Klaviyo o similiar. Flujos: welcome, abandon cart, winback.", tags: ["email", "automation"] },
  { id: "p5", title: "Expandir a TikTok Ads", type: "campaign", status: "backlog", priority: "medium", quarter: "Q3 2025", description: "Prueba piloto con $1k presupuesto. Creativos verticales 9:16.", tags: ["tiktok"] },
  { id: "p6", title: "Nuevo sitio web con CRO", type: "feature", status: "backlog", priority: "high", quarter: "Q3 2025", owner: "DS" },
  { id: "p7", title: "$50k ingresos mensuales", type: "milestone", status: "backlog", priority: "high", quarter: "Q4 2025" },
  { id: "p8", title: "Bug: tracking de conversiones duplicado", type: "bug", status: "in_progress", priority: "high", quarter: "Q2 2025", description: "El pixel de Meta está disparando eventos dobles en mobile.", owner: "DS" },
  { id: "p9", title: "Campaña de Black Friday", type: "campaign", status: "planned", priority: "high", quarter: "Q4 2025", tags: ["meta", "seasonal"] },
  { id: "p10", title: "Research: influencer marketing", type: "idea", status: "backlog", priority: "low", quarter: "Q3 2025" },
];

export default function PlanningPage() {
  const [items, setItems] = useState<PlanningItem[]>(INITIAL_ITEMS);
  const [activeQuarter, setActiveQuarter] = useState("Q2 2025");
  const [activeType, setActiveType] = useState<ItemType | "all">("all");
  const [selected, setSelected] = useState<PlanningItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", type: "feature" as ItemType, priority: "medium" as Priority, quarter: activeQuarter, description: "" });

  const filtered = items.filter(i => {
    const matchQ = i.quarter === activeQuarter;
    const matchType = activeType === "all" || i.type === activeType;
    return matchQ && matchType;
  });

  const byStatus = (status: ItemStatus) => filtered.filter(i => i.status === status);

  const addItem = () => {
    if (!newItem.title.trim()) return;
    setItems(prev => [...prev, { ...newItem, id: `p${Date.now()}`, status: "backlog" }]);
    setShowAddForm(false);
    setNewItem({ title: "", type: "feature", priority: "medium", quarter: activeQuarter, description: "" });
  };

  const updateStatus = (id: string, status: ItemStatus) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const inputStyle = { width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: 8, padding: "8px 12px", color: "#ccc", fontSize: 13, outline: "none" };

  return (
    <div style={{ padding: "0 0 40px" }}>
      <Header
        title="Planeación"
        subtitle="Roadmap estratégico · Campañas, features y milestones"
      />

      <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Quarter Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, background: "#171717", borderRadius: 12, overflow: "hidden", border: "1px solid #171717" }}>
          {(["all", ...Object.keys(STATUS_CONFIG)] as (ItemStatus | "all")[]).map((s, i) => {
            const count = s === "all" ? filtered.length : byStatus(s as ItemStatus).length;
            const cfg = s === "all" ? { label: "Total", color: "#fff" } : STATUS_CONFIG[s as ItemStatus];
            return (
              <div key={i} style={{ background: "#111", padding: "14px 18px" }}>
                <p style={{ fontSize: 10.5, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{cfg.label}</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: cfg.color }}>{count}</p>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {/* Quarter Tabs */}
          <div style={{ display: "flex", gap: 6 }}>
            {QUARTERS.map(q => (
              <button
                key={q}
                onClick={() => setActiveQuarter(q)}
                style={{
                  background: activeQuarter === q ? "#fff" : "#111",
                  color: activeQuarter === q ? "#000" : "#555",
                  border: `1px solid ${activeQuarter === q ? "#fff" : "#222"}`,
                  borderRadius: 8,
                  padding: "6px 14px",
                  fontSize: 12.5,
                  cursor: "pointer",
                  fontWeight: activeQuarter === q ? 600 : 400,
                }}
              >
                {q}
              </button>
            ))}
          </div>

          <div style={{ width: 1, height: 24, background: "#222" }} />

          {/* Type Filter */}
          <div style={{ display: "flex", gap: 5 }}>
            <button onClick={() => setActiveType("all")} style={{ background: activeType === "all" ? "#222" : "transparent", color: activeType === "all" ? "#fff" : "#555", border: "1px solid #222", borderRadius: 7, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>
              Todos
            </button>
            {(Object.keys(TYPE_CONFIG) as ItemType[]).map(t => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: activeType === t ? `${TYPE_CONFIG[t].color}15` : "transparent",
                  color: activeType === t ? TYPE_CONFIG[t].color : "#555",
                  border: `1px solid ${activeType === t ? TYPE_CONFIG[t].color + "40" : "#222"}`,
                  borderRadius: 7,
                  padding: "5px 12px",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {TYPE_CONFIG[t].icon} {TYPE_CONFIG[t].label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            style={{ marginLeft: "auto", background: "#fff", color: "#000", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
          >
            <Plus size={13} /> Agregar Item
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="fade-in" style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: 12, padding: "20px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 5 }}>Título *</label>
              <input
                autoFocus
                placeholder="Ej: Lanzar campaña de retargeting..."
                value={newItem.title}
                onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && addItem()}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 5 }}>Tipo</label>
              <select value={newItem.type} onChange={e => setNewItem(p => ({ ...p, type: e.target.value as ItemType }))} style={inputStyle}>
                {(Object.keys(TYPE_CONFIG) as ItemType[]).map(t => <option key={t} value={t}>{TYPE_CONFIG[t].label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 5 }}>Prioridad</label>
              <select value={newItem.priority} onChange={e => setNewItem(p => ({ ...p, priority: e.target.value as Priority }))} style={inputStyle}>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 5 }}>Descripción</label>
              <input placeholder="Descripción breve..." value={newItem.description} onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
              <button onClick={addItem} style={{ background: "#fff", color: "#000", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Agregar
              </button>
              <button onClick={() => setShowAddForm(false)} style={{ background: "transparent", color: "#555", border: "1px solid #222", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Roadmap Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {(Object.keys(STATUS_CONFIG) as ItemStatus[]).map(status => {
            const colItems = byStatus(status);
            const cfg = STATUS_CONFIG[status];
            return (
              <div key={status} style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#ccc" }}>{cfg.label}</span>
                  <span style={{ fontSize: 11, color: "#444", background: "#1a1a1a", borderRadius: 10, padding: "1px 8px" }}>{colItems.length}</span>
                </div>

                <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8, minHeight: 80 }}>
                  {colItems.length === 0 && (
                    <p style={{ fontSize: 12, color: "#333", textAlign: "center", padding: "16px 0" }}>Sin items</p>
                  )}
                  {colItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => setSelected(item === selected ? null : item)}
                      style={{
                        background: selected?.id === item.id ? "#1c1c1c" : "#0d0d0d",
                        border: `1px solid ${selected?.id === item.id ? "#2a2a2a" : "#1a1a1a"}`,
                        borderRadius: 8,
                        padding: "10px 12px",
                        cursor: "pointer",
                        transition: "all 0.12s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10.5, color: TYPE_CONFIG[item.type].color, fontWeight: 600 }}>
                              {TYPE_CONFIG[item.type].icon} {TYPE_CONFIG[item.type].label}
                            </span>
                            <span style={{ fontSize: 10, color: item.priority === "high" ? "#f59e0b" : item.priority === "medium" ? "#3b82f6" : "#555" }}>
                              {item.priority === "high" ? "↑ Alta" : item.priority === "medium" ? "→ Media" : "↓ Baja"}
                            </span>
                          </div>
                          <p style={{ fontSize: 13, color: status === "completed" ? "#555" : "#ddd", lineHeight: 1.3, textDecoration: status === "completed" ? "line-through" : "none" }}>
                            {item.title}
                          </p>
                          {item.description && (
                            <p style={{ fontSize: 11.5, color: "#444", marginTop: 4, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                        {item.owner && (
                          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#888", flexShrink: 0 }}>
                            {item.owner}
                          </div>
                        )}
                      </div>

                      {/* Quick Status Change */}
                      {selected?.id === item.id && (
                        <div style={{ marginTop: 10, display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {(Object.keys(STATUS_CONFIG) as ItemStatus[]).map(s => (
                            <button
                              key={s}
                              onClick={e => { e.stopPropagation(); updateStatus(item.id, s); }}
                              style={{
                                background: item.status === s ? `${STATUS_CONFIG[s].color}20` : "transparent",
                                border: `1px solid ${item.status === s ? STATUS_CONFIG[s].color : "#2a2a2a"}`,
                                borderRadius: 5,
                                padding: "3px 8px",
                                fontSize: 10.5,
                                color: item.status === s ? STATUS_CONFIG[s].color : "#555",
                                cursor: "pointer",
                              }}
                            >
                              {STATUS_CONFIG[s].label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
