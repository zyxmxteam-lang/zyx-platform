"use client";

import Header from "@/components/Header";
import { calendarEvents as initialEvents } from "@/lib/data";
import { useToast } from "@/components/Toast";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const eventTypeLabels: Record<string, string> = {
  launch: "Lanzamiento",
  review: "Revisión",
  deadline: "Deadline",
  event: "Evento",
  report: "Reporte",
  pause: "Pausa",
  planning: "Planeación",
  test: "A/B Test",
};

const TYPE_COLORS: Record<string, string> = {
  launch: "#22c55e",
  review: "#3b82f6",
  deadline: "#f59e0b",
  event: "#a855f7",
  report: "#06b6d4",
  pause: "#ef4444",
  planning: "#22c55e",
  test: "#f59e0b",
};

interface CalEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  color: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0d0d0d",
  border: "1px solid #222",
  borderRadius: 8,
  padding: "9px 13px",
  color: "#ccc",
  fontSize: 13,
  outline: "none",
};

export default function CalendarPage() {
  const { toast } = useToast();
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState<CalEvent[]>(initialEvents as CalEvent[]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    date: today.toISOString().split("T")[0],
    type: "event",
  });

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(e => e.date === dateStr);
  };

  const allMonthEvents = events.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  }).sort((a, b) => a.date.localeCompare(b.date));

  const isToday = (day: number) => {
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const openModalForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setForm(prev => ({ ...prev, date: dateStr }));
    setSelectedDay(dateStr);
    setShowModal(true);
  };

  const handleCreate = () => {
    if (!form.title.trim()) {
      toast("Escribe un título para el evento", "error");
      return;
    }
    const newEvent: CalEvent = {
      id: `ev${Date.now()}`,
      title: form.title,
      date: form.date,
      type: form.type,
      color: TYPE_COLORS[form.type] ?? "#888",
    };
    setEvents(prev => [...prev, newEvent]);
    toast(`Evento "${form.title}" creado`, "success");
    setShowModal(false);
    setForm({ title: "", date: today.toISOString().split("T")[0], type: "event" });
  };

  return (
    <div style={{ padding: "0 0 40px" }}>
      <Header title="Calendario" subtitle="Gestión de campañas, deadlines y eventos del equipo" />

      <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Upcoming Events */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {allMonthEvents.slice(0, 4).map(ev => (
            <div
              key={ev.id}
              className="card-hover"
              style={{
                background: "#111",
                border: `1px solid ${ev.color}25`,
                borderLeft: `3px solid ${ev.color}`,
                borderRadius: 10,
                padding: "14px 16px",
                cursor: "pointer",
              }}
            >
              <p style={{ fontSize: 10.5, color: ev.color, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 5 }}>
                {eventTypeLabels[ev.type] ?? ev.type}
              </p>
              <p style={{ fontSize: 13, color: "#ddd", fontWeight: 500, lineHeight: 1.3 }}>{ev.title}</p>
              <p style={{ fontSize: 11, color: "#444", marginTop: 5 }}>{ev.date}</p>
            </div>
          ))}
        </div>

        {/* Main Calendar + Sidebar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>
          {/* Calendar Grid */}
          <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, overflow: "hidden" }}>
            {/* Nav */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #1c1c1c" }}>
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>
                {MONTHS[month]} {year}
              </h2>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  onClick={() => setCurrent(new Date(year, month - 1, 1))}
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#888", display: "flex", alignItems: "center" }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrent(new Date(today.getFullYear(), today.getMonth(), 1))}
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, padding: "6px 12px", cursor: "pointer", color: "#888", fontSize: 12 }}
                >
                  Hoy
                </button>
                <button
                  onClick={() => setCurrent(new Date(year, month + 1, 1))}
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#888", display: "flex", alignItems: "center" }}
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => { setForm(prev => ({ ...prev, date: `${year}-${String(month + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}` })); setShowModal(true); }}
                  style={{ background: "#fff", color: "#000", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}
                >
                  <Plus size={13} /> Evento
                </button>
              </div>
            </div>

            {/* Day Headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #1c1c1c" }}>
              {DAYS.map(d => (
                <div key={d} style={{ padding: "10px", textAlign: "center", fontSize: 11, color: "#444", fontWeight: 500, letterSpacing: "0.05em" }}>
                  {d.toUpperCase()}
                </div>
              ))}
            </div>

            {/* Day Cells */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
              {cells.map((day, idx) => {
                const dayEvents = day ? getEventsForDay(day) : [];
                const _isToday = day ? isToday(day) : false;
                return (
                  <div
                    key={idx}
                    onClick={() => day && openModalForDay(day)}
                    style={{
                      minHeight: 90,
                      padding: "8px",
                      borderRight: (idx + 1) % 7 !== 0 ? "1px solid #1a1a1a" : "none",
                      borderBottom: Math.ceil((idx + 1) / 7) < cells.length / 7 ? "1px solid #1a1a1a" : "none",
                      background: _isToday ? "rgba(255,255,255,0.03)" : "transparent",
                      cursor: day ? "pointer" : "default",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={e => { if (day) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { if (day) (e.currentTarget as HTMLElement).style.background = _isToday ? "rgba(255,255,255,0.03)" : "transparent"; }}
                  >
                    {day && (
                      <>
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            background: _isToday ? "#fff" : "transparent",
                            color: _isToday ? "#000" : "#888",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12.5,
                            fontWeight: _isToday ? 700 : 400,
                            marginBottom: 4,
                          }}
                        >
                          {day}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {dayEvents.slice(0, 2).map(ev => (
                            <div
                              key={ev.id}
                              style={{
                                background: `${ev.color}18`,
                                borderLeft: `2px solid ${ev.color}`,
                                borderRadius: 3,
                                padding: "2px 5px",
                                fontSize: 9.5,
                                color: ev.color,
                                fontWeight: 500,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {ev.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <p style={{ fontSize: 9, color: "#444", padding: "1px 4px" }}>+{dayEvents.length - 2} más</p>
                          )}
                          {dayEvents.length === 0 && (
                            <div style={{ fontSize: 9, color: "#2a2a2a", padding: "1px 4px", opacity: 0 }} className="day-add">+ Agregar</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Events List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, padding: "18px 20px" }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: "#fff" }}>
                {MONTHS[month]} — Todos los Eventos
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {allMonthEvents.length === 0 && (
                  <p style={{ fontSize: 12, color: "#444", textAlign: "center", padding: "20px 0" }}>Sin eventos este mes</p>
                )}
                {allMonthEvents.map(ev => (
                  <div
                    key={ev.id}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "10px",
                      borderRadius: 8,
                      background: "#0d0d0d",
                      border: "1px solid #1a1a1a",
                    }}
                  >
                    <div style={{ width: 3, borderRadius: 2, background: ev.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, color: "#ddd", fontWeight: 500, lineHeight: 1.3 }}>{ev.title}</p>
                      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                        <span style={{ fontSize: 10, color: ev.color, fontWeight: 600 }}>{eventTypeLabels[ev.type]}</span>
                        <span style={{ fontSize: 10, color: "#444" }}>·</span>
                        <span style={{ fontSize: 10, color: "#444" }}>{new Date(ev.date + "T00:00:00").getDate()} {MONTHS[new Date(ev.date + "T00:00:00").getMonth()]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, padding: "16px 20px" }}>
              <h4 style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Tipos de Evento</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {Object.entries(eventTypeLabels).map(([type, label]) => (
                  <div key={type} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: TYPE_COLORS[type] ?? "#888", flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#666" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: 16, padding: "28px", width: "100%", maxWidth: 420 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>Nuevo Evento</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#444" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 6 }}>Título del evento</label>
                <input
                  autoFocus
                  placeholder="ej. Lanzamiento campaña Q3..."
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handleCreate()}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 6 }}>Fecha</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                  style={{ ...inputStyle, colorScheme: "dark" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, color: "#555", display: "block", marginBottom: 6 }}>Tipo</label>
                <select
                  value={form.type}
                  onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                  style={{ ...inputStyle, width: "100%" }}
                >
                  {Object.entries(eventTypeLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {form.type && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: `${TYPE_COLORS[form.type]}12`, border: `1px solid ${TYPE_COLORS[form.type]}25`, borderRadius: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: TYPE_COLORS[form.type] ?? "#888", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: TYPE_COLORS[form.type] ?? "#888" }}>{eventTypeLabels[form.type]}</span>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#888", borderRadius: 10, padding: "10px", fontSize: 13, cursor: "pointer" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  style={{ flex: 2, background: "#fff", color: "#000", border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Crear Evento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
