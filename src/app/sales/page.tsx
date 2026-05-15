"use client";

import Header from "@/components/Header";
import KPICard from "@/components/KPICard";
import { salesData, funnelData, weeklyData } from "@/lib/data";
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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: {active?: boolean, payload?: Array<{value: number, name: string, color: string}>, label?: string}) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 14px" }}>
        <p style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ fontSize: 13, color: p.color, fontWeight: 600 }}>
            {p.name}: {typeof p.value === "number" && p.value > 100 ? `$${p.value.toLocaleString("es-MX")}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const COLORS = ["#ffffff", "#cccccc", "#999999", "#666666", "#444444", "#2a2a2a"];

export default function SalesPage() {
  const totalRevenue = salesData.reduce((a, d) => a + d.revenue, 0);
  const totalOrders = salesData.reduce((a, d) => a + d.orders, 0);
  const avgAov = salesData.reduce((a, d) => a + d.aov, 0) / salesData.length;
  const lastMonth = salesData[salesData.length - 1];
  const prevMonth = salesData[salesData.length - 2];
  const growthPct = (((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1);

  return (
    <div style={{ padding: "0 0 40px" }}>
      <Header
        title="Ventas & Métricas"
        subtitle="Análisis de ingresos, conversiones y embudo de ventas"
      />

      <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <KPICard
            label="Ingresos Totales (6M)"
            value={totalRevenue}
            change={`+${growthPct}%`}
            up={true}
            prefix="$"
            description="mes actual"
            color="#22c55e"
          />
          <KPICard
            label="Órdenes Totales (6M)"
            value={totalOrders}
            change="+28%"
            up={true}
            description="vs mismo período"
          />
          <KPICard
            label="Ticket Promedio"
            value={`$${avgAov.toFixed(0)}`}
            change="+$9.10"
            up={true}
            description="crecimiento continuo"
            color="#3b82f6"
          />
          <KPICard
            label="Tasa Conversión"
            value="3.2%"
            change="+0.4%"
            up={true}
            description="landing → compra"
            color="#a855f7"
          />
        </div>

        {/* Revenue Chart */}
        <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 20 }}>
          <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>Ingresos Mensuales</h3>
              <p style={{ fontSize: 12, color: "#444", marginTop: 2 }}>Últimos 6 meses · Tendencia ascendente</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="revAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#444", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#444", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Ingresos" stroke="#22c55e" strokeWidth={2.5} fill="url(#revAreaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>Órdenes por Mes</h3>
              <p style={{ fontSize: 12, color: "#444", marginTop: 2 }}>Volumen de ventas</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={salesData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#444", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#444", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" name="Órdenes" fill="#3b82f6" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel + Weekly */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Funnel */}
          <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, padding: "20px 24px" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Embudo de Conversión</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {funnelData.map((stage, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: i === 0 ? "#fff" : "#888" }}>{stage.stage}</span>
                    <div style={{ display: "flex", gap: 12 }}>
                      <span style={{ fontSize: 12, color: "#555" }}>{stage.pct}%</span>
                      <span style={{ fontSize: 12, color: "#aaa", fontWeight: 500 }}>
                        {stage.value >= 1000 ? `${(stage.value/1000).toFixed(0)}k` : stage.value}
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 5, background: "#1a1a1a", borderRadius: 3, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${stage.pct}%`,
                        background: i === 0 ? "#fff" : `hsl(${220 + i * 20}, 70%, ${60 - i * 5}%)`,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                  {i < funnelData.length - 1 && (
                    <p style={{ fontSize: 10, color: "#3a3a3a", marginTop: 2, textAlign: "right" }}>
                      ↓ drop {(((funnelData[i].value - funnelData[i+1].value) / funnelData[i].value) * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Performance */}
          <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, padding: "20px 24px" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Performance Semanal</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#444", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#444", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="revenue" name="Ingresos" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: "#22c55e" }} yAxisId={0} />
                <Line type="monotone" dataKey="leads" name="Leads" stroke="#a855f7" strokeWidth={2} dot={{ r: 3, fill: "#a855f7" }} yAxisId={0} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Breakdown Table */}
        <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #1c1c1c" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Desglose Mensual</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0d0d0d" }}>
                {["Mes", "Ingresos", "Órdenes", "Ticket Promedio", "Crecimiento MoM"].map(h => (
                  <th key={h} style={{ padding: "10px 20px", fontSize: 11, color: "#555", textAlign: "left", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salesData.map((d, i) => {
                const prev = salesData[i - 1];
                const momGrowth = prev ? (((d.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1) : null;
                return (
                  <tr key={d.month} style={{ borderTop: "1px solid #1a1a1a", background: i % 2 === 0 ? "#111" : "#0e0e0e" }}>
                    <td style={{ padding: "13px 20px", fontSize: 14, color: "#fff", fontWeight: 600 }}>{d.month}</td>
                    <td style={{ padding: "13px 20px", fontSize: 13.5, color: "#22c55e", fontWeight: 600 }}>${d.revenue.toLocaleString("es-MX")}</td>
                    <td style={{ padding: "13px 20px", fontSize: 13, color: "#ccc" }}>{d.orders}</td>
                    <td style={{ padding: "13px 20px", fontSize: 13, color: "#aaa" }}>${d.aov.toFixed(2)}</td>
                    <td style={{ padding: "13px 20px" }}>
                      {momGrowth ? (
                        <span style={{ fontSize: 13, color: parseFloat(momGrowth) >= 0 ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
                          {parseFloat(momGrowth) >= 0 ? "+" : ""}{momGrowth}%
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: "#333" }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
