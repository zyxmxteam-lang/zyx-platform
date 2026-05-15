"use client";

import Header from "@/components/Header";
import { useState } from "react";
import { Plus, X, MoreHorizontal, CheckCircle2, Clock, AlertCircle, Zap, Flag } from "lucide-react";

type Priority = "low" | "medium" | "high" | "urgent";
type Status = "todo" | "in_progress" | "review" | "done";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: string;
  assignee?: string;
  tags?: string[];
}

const COLUMNS: { id: Status; label: string; color: string }[] = [
  { id: "todo", label: "Por Hacer", color: "#555" },
  { id: "in_progress", label: "En Progreso", color: "#3b82f6" },
  { id: "review", label: "En Revisión", color: "#f59e0b" },
  { id: "done", label: "Completado", color: "#22c55e" },
];

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; icon: React.ReactNode }> = {
  low: { label: "Baja", color: "#555", icon: <Flag size={11} /> },
  medium: { label: "Media", color: "#3b82f6", icon: <Flag size={11} /> },
  high: { label: "Alta", color: "#f59e0b", icon: <Flag size={11} /> },
  urgent: { label: "Urgente", color: "#ef4444", icon: <Zap size={11} /> },
};

const INITIAL_TASKS: Task[] = [
  { id: "t1", title: "Crear brief de creativos para Q3", priority: "high", status: "todo", dueDate: "2025-06-10", assignee: "DS", tags: ["meta", "creative"] },
  { id: "t2", title: "Revisar ROAS semanal de campañas activas", priority: "urgent", status: "todo", dueDate: "2025-05-16", assignee: "DS", tags: ["análisis"] },
  { id: "t3", title: "Configurar retargeting para audiencia LAL", priority: "medium", status: "in_progress", dueDate: "2025-05-20", assignee: "DS", tags: ["meta"] },
  { id: "t4", title: "Análisis competitivo de creativos en Instagram", priority: "high", status: "in_progress", dueDate: "2025-05-22", tags: ["research"] },
  { id: "t5", title: "Preparar reporte mensual para stakeholders", priority: "high", status: "review", dueDate: "2025-05-30", assignee: "DS" },
  { id: "t6", title: "Implementar UTM tracking en todas las campañas", priority: "medium", status: "done", tags: ["setup"] },
  { id: "t7", title: "Setup de pixel de Meta en landing pages", priority: "urgent", status: "done", assignee: "DS" },
  { id: "t8", title: "Actualizar buyer personas Q2 2025", priority: "low", status: "todo", tags: ["research", "audiencia"] },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [adding, setAdding] = useState<Status | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("medium");
  const [selected, setSelected] = useState<Task | null>(null);

  const byStatus = (status: Status) => tasks.filter(t => t.status === status);

  const addTask = (status: Status) => {
    if (!newTitle.trim()) return;
    const task: Task = {
      id: `t${Date.now()}`,
      title: newTitle.trim(),
      priority: newPriority,
      status,
    };
    setTasks(prev => [...prev, task]);
    setNewTitle("");
    setAdding(null);
  };

  const moveTask = (id: string, newStatus: Status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const totalDone = tasks.filter(t => t.status === "done").length;
  const totalTasks = tasks.length;
  const pct = Math.round((totalDone / totalTasks) * 100);

  return (
    <div style={{ padding: "0 0 40px" }}>
      <Header
        title="Tareas"
        subtitle={`${totalDone}/${totalTasks} completadas · ${pct}% de progreso`}
      />

      <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1, height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "#22c55e", borderRadius: 2, transition: "width 0.4s ease" }} />
          </div>
          <span style={{ fontSize: 12, color: "#555", whiteSpace: "nowrap" }}>{pct}% completado</span>
          <button
            onClick={() => setAdding("todo")}
            style={{ background: "#fff", color: "#000", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
          >
            <Plus size={13} /> Nueva Tarea
          </button>
        </div>

        {/* Kanban Board */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, alignItems: "start" }}>
          {COLUMNS.map(col => {
            const colTasks = byStatus(col.id);
            return (
              <div key={col.id}>
                {/* Column Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: col.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "#ccc" }}>{col.label}</span>
                    <span style={{ fontSize: 11, color: "#444", background: "#1a1a1a", borderRadius: 10, padding: "1px 7px" }}>{colTasks.length}</span>
                  </div>
                  <button
                    onClick={() => { setAdding(col.id); setNewTitle(""); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#444", display: "flex", padding: 2 }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Tasks */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {colTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => setSelected(task)}
                      style={{
                        background: selected?.id === task.id ? "#1a1a1a" : "#111",
                        border: `1px solid ${selected?.id === task.id ? "#2a2a2a" : "#1c1c1c"}`,
                        borderRadius: 10,
                        padding: "12px 14px",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {/* Priority */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 7 }}>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 10.5,
                            color: PRIORITY_CONFIG[task.priority].color,
                            fontWeight: 600,
                          }}
                        >
                          {PRIORITY_CONFIG[task.priority].icon}
                          {PRIORITY_CONFIG[task.priority].label}
                        </span>
                        <button
                          onClick={e => { e.stopPropagation(); deleteTask(task.id); }}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#333", padding: 0, display: "flex" }}
                        >
                          <X size={12} />
                        </button>
                      </div>

                      <p style={{ fontSize: 13, color: task.status === "done" ? "#555" : "#ddd", lineHeight: 1.4, textDecoration: task.status === "done" ? "line-through" : "none" }}>
                        {task.title}
                      </p>

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                          {task.tags.map(tag => (
                            <span key={tag} style={{ fontSize: 10, color: "#555", background: "#1a1a1a", padding: "2px 7px", borderRadius: 4, border: "1px solid #222" }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        {task.dueDate && (
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10.5, color: "#444" }}>
                            <Clock size={10} />
                            {task.dueDate}
                          </span>
                        )}
                        {task.assignee && (
                          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#888", marginLeft: "auto" }}>
                            {task.assignee}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add Task Input */}
                  {adding === col.id && (
                    <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: 10, padding: "12px 14px" }}>
                      <input
                        autoFocus
                        placeholder="Título de la tarea..."
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") addTask(col.id);
                          if (e.key === "Escape") setAdding(null);
                        }}
                        style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "#e0e0e0", fontSize: 13, marginBottom: 8 }}
                      />
                      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                        {(["low", "medium", "high", "urgent"] as Priority[]).map(p => (
                          <button
                            key={p}
                            onClick={() => setNewPriority(p)}
                            style={{
                              background: newPriority === p ? `${PRIORITY_CONFIG[p].color}20` : "transparent",
                              border: `1px solid ${newPriority === p ? PRIORITY_CONFIG[p].color : "#222"}`,
                              borderRadius: 5,
                              padding: "2px 8px",
                              fontSize: 10.5,
                              color: PRIORITY_CONFIG[p].color,
                              cursor: "pointer",
                            }}
                          >
                            {PRIORITY_CONFIG[p].label}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => addTask(col.id)} style={{ background: "#fff", color: "#000", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          Agregar
                        </button>
                        <button onClick={() => setAdding(null)} style={{ background: "transparent", color: "#555", border: "1px solid #222", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Task Detail Panel */}
        {selected && (
          <div className="fade-in" style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, padding: "24px", maxWidth: 600 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, flex: 1, marginRight: 12 }}>{selected.title}</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#444" }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              {/* Status selector */}
              <div>
                <p style={{ fontSize: 11, color: "#555", marginBottom: 5 }}>Estado</p>
                <div style={{ display: "flex", gap: 5 }}>
                  {COLUMNS.map(col => (
                    <button
                      key={col.id}
                      onClick={() => { moveTask(selected.id, col.id); setSelected({ ...selected, status: col.id }); }}
                      style={{
                        background: selected.status === col.id ? `${col.color}15` : "#0d0d0d",
                        border: `1px solid ${selected.status === col.id ? col.color : "#222"}`,
                        borderRadius: 6,
                        padding: "4px 10px",
                        fontSize: 11,
                        color: selected.status === col.id ? col.color : "#555",
                        cursor: "pointer",
                        fontWeight: selected.status === col.id ? 600 : 400,
                      }}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {selected.dueDate && (
              <p style={{ fontSize: 12.5, color: "#666", display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                <Clock size={13} /> Vence: {selected.dueDate}
              </p>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                onClick={() => deleteTask(selected.id)}
                style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "7px 14px", fontSize: 12.5, cursor: "pointer" }}
              >
                Eliminar tarea
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
