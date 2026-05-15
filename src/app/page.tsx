"use client";

import Header from "@/components/Header";
import KPICard from "@/components/KPICard";
import { kpis, salesData, weeklyData, metaCampaigns, notifications } from "@/lib/data";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { CheckCircle, AlertTriangle, Info, XCircle, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const CustomTooltip = ({ active, payload, label }: {active?: boolean, payload?: Array<{value: number, name: string, color: string}>, label?: string}) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 14px" }}>
        <p style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ fontSize: 13, color: p.color, fontWeight: 600 }}>
            {p.name}: {typeof p.value === "number" && p.value > 1000 ? `$${p.value.toLocaleString("es-MX")}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const notifIcon = (type: string) => {
  if (type === "success") return <CheckCircle size={14} color="#22c55e" />;
  if (type === "warning") return <AlertTriangle size={14} color="#f59e0b" />;
  if (type === "alert") return <XCircle size={14} color="#ef4444" />;
  return <Info size={14} color="#3b82f6" />;
};

export default function OverviewPage() {
  const activeCampaigns = metaCampaigns.filter(c => c.status === "active");

  return (
    <div style={{ padding: "0 0 40px" }}>
      <Header
        title="Overview"
        subtitle={`Bienvenido de vuelta, Diego — ${activeCampaigns.length} campañas activas`}
      />

      <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 28 }}>

        {/* KPI Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <KPICard
            label={kpis.totalSpend.label}
            value={kpis.totalSpend.value}
            change={kpis.totalSpend.change}
            up={kpis.totalSpend.up}
            prefix="$"
            description="vs mes anterior"
          />
          <KPICard
            label={kpis.totalRevenue.label}
            value={kpis.totalRevenue.value}
            change={kpis.totalRevenue.change}
            up={kpis.totalRevenue.up}
            prefix="$"
            description="vs mes anterior"
            color="#22c55e"
          />
          <KPICard
            label={kpis.avgRoas.label}
            value={kpis.avgRoas.value + "x"}
            change={kpis.avgRoas.change}
            up={kpis.avgRoas.up}
            description="benchmark: 3.2x"
            color="#3b82f6"
          />
          <KPICard
            label={kpis.totalLeads.label}
            value={kpis.totalLeads.value}
            change={kpis.totalLeads.change}
            up={kpis.totalLeads.up}
            description="este mes"
          />
          <KPICard
            label={kpis.avgCpa.label}
            value={kpis.avgCpa.value}
            change={kpis.avgCpa.change}
            up={kpis.avgCpa.up}
            prefix="$"
            description="benchmark: $5.80"
            color="#a855f7"
          />
          <KPICard
            label={kpis.activeCampaigns.label}
            value={kpis.activeCampaigns.value}
            change={kpis.activeCampaigns.change}
            up={kpis.activeCampaigns.up}
            description="campañas corriendo"
          />
        </div>

        {/* Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
          {/* Revenue Trend */}
          <div
            style={{
              background: "#111",
              border: "1px solid #1c1c1c",
              borderRadius: 12,
              padding: "20px 24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Ingresos vs Inversión</h3>
                <p style={{ fontSize: 12, color: "#444", marginTop: 2 }}>Últimos 6 meses</p>
              </div>
              <span style={{ fontSize: 11, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>
                ROAS 4.77x
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#444", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#444", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Ingresos" stroke="#22c55e" strokeWidth={2} fill="url(#revGrad)" />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Spend */}
          <div
            style={{
              background: "#111",
              border: "1px solid #1c1c1c",
              borderRadius: 12,
              padding: "20px 24px",
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Inversión Semanal</h3>
              <p style={{ fontSize: 12, color: "#444", marginTop: 2 }}>Esta semana por día</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#444", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#444", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="spend" name="Gasto" fill="#3b82f6" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Active Campaigns */}
          <div
            style={{
              background: "#111",
              border: "1px solid #1c1c1c",
              borderRadius: 12,
              padding: "20px 24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Campañas Activas</h3>
              <Link href="/campaigns" style={{ fontSize: 12, color: "#555", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                Ver todas <ArrowRight size={12} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {activeCampaigns.slice(0, 4).map(c => (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    background: "#161616",
                    borderRadius: 8,
                    border: "1px solid #1e1e1e",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      className="pulse-dot"
                      style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "block", flexShrink: 0 }}
                    />
                    <div>
                      <p style={{ fontSize: 12.5, color: "#ddd", fontWeight: 500 }}>{c.name}</p>
                      <p style={{ fontSize: 11, color: "#444", marginTop: 1 }}>{c.platform}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 13, color: "#22c55e", fontWeight: 600 }}>{c.roas}x ROAS</p>
                    <p style={{ fontSize: 11, color: "#555" }}>
                      ${c.spent.toLocaleString("es-MX")} gastado
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div
            style={{
              background: "#111",
              border: "1px solid #1c1c1c",
              borderRadius: 12,
              padding: "20px 24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Alertas Recientes</h3>
                <Zap size={13} color="#f59e0b" />
              </div>
              <Link href="/notifications" style={{ fontSize: 12, color: "#555", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                Ver todas <ArrowRight size={12} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {notifications.slice(0, 5).map(n => (
                <div
                  key={n.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "10px 12px",
                    background: n.read ? "#0e0e0e" : "#161616",
                    borderRadius: 8,
                    border: `1px solid ${n.read ? "#181818" : "#222"}`,
                  }}
                >
                  <span style={{ marginTop: 1, flexShrink: 0 }}>{notifIcon(n.type)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, color: n.read ? "#555" : "#ccc", lineHeight: 1.4 }}>
                      {n.message}
                    </p>
                    <p style={{ fontSize: 10, color: "#444", marginTop: 3 }}>{n.time}</p>
                  </div>
                  {!n.read && (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", flexShrink: 0, marginTop: 4 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
