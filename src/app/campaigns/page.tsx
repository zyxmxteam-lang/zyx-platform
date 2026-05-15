"use client";

import Header from "@/components/Header";
import { metaCampaigns, weeklyData } from "@/lib/data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Pause, Play, ExternalLink } from "lucide-react";
import { useState } from "react";

const StatusBadge = ({ status }: { status: string }) => (
  <span
    style={{
      fontSize: 11,
      fontWeight: 600,
      padding: "3px 10px",
      borderRadius: 20,
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      background: status === "active" ? "rgba(34,197,94,0.1)" : "rgba(100,100,100,0.1)",
      color: status === "active" ? "#22c55e" : "#666",
      border: `1px solid ${status === "active" ? "rgba(34,197,94,0.2)" : "#222"}`,
    }}
  >
    <span
      style={{
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: status === "active" ? "#22c55e" : "#555",
      }}
    />
    {status === "active" ? "Activa" : "Pausada"}
  </span>
);

const CustomTooltip = ({ active, payload, label }: {active?: boolean, payload?: Array<{value: number, name: string, color: string}>, label?: string}) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 14px" }}>
        <p style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ fontSize: 13, color: p.color, fontWeight: 600 }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CampaignsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const campaign = metaCampaigns.find(c => c.id === selected) ?? metaCampaigns[0];

  const totals = {
    spend: metaCampaigns.reduce((a, c) => a + c.spent, 0),
    revenue: metaCampaigns.reduce((a, c) => a + c.revenue, 0),
    conversions: metaCampaigns.reduce((a, c) => a + c.conversions, 0),
    impressions: metaCampaigns.reduce((a, c) => a + c.impressions, 0),
  };
  const avgRoas = (totals.revenue / totals.spend).toFixed(2);

  return (
    <div style={{ padding: "0 0 40px" }}>
      <Header
        title="Campañas Meta"
        subtitle="Facebook & Instagram Ads — rendimiento en tiempo real"
      />

      <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Summary Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1,
            background: "#1c1c1c",
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid #1c1c1c",
          }}
        >
          {[
            { label: "Inversión Total", value: `$${totals.spend.toLocaleString("es-MX", { maximumFractionDigits: 0 })}` },
            { label: "Ingresos Generados", value: `$${totals.revenue.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`, color: "#22c55e" },
            { label: "ROAS Promedio", value: `${avgRoas}x`, color: "#3b82f6" },
            { label: "Total Conversiones", value: totals.conversions.toLocaleString("es-MX"), color: "#a855f7" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#111", padding: "18px 22px" }}>
              <p style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{s.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: s.color ?? "#fff", letterSpacing: "-0.02em" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, padding: "20px 24px" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Spend vs Revenue por Campaña</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={metaCampaigns.map(c => ({ name: c.name.split(" — ")[0], spend: c.spent, revenue: c.revenue }))}
                barSize={14}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#444", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#444", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(1)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#666" }} />
                <Bar dataKey="spend" name="Inversión" fill="#3b82f6" radius={[3,3,0,0]} />
                <Bar dataKey="revenue" name="Ingresos" fill="#22c55e" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, padding: "20px 24px" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Leads por Día (Esta Semana)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#444", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#444", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="leads" name="Leads" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: "#a855f7", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaigns Table */}
        <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #1c1c1c" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Todas las Campañas</h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0d0d0d" }}>
                  {["Campaña", "Estado", "Plataforma", "Presupuesto", "Gastado", "Impr.", "CTR", "CPC", "Conv.", "CPA", "ROAS", "Ingresos", "Tendencia"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", fontSize: 10.5, color: "#555", textAlign: "left", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metaCampaigns.map((c, i) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c.id === selected ? null : c.id)}
                    style={{
                      background: selected === c.id ? "rgba(255,255,255,0.03)" : i % 2 === 0 ? "#111" : "#0e0e0e",
                      cursor: "pointer",
                      borderTop: "1px solid #1a1a1a",
                      transition: "background 0.1s",
                    }}
                  >
                    <td style={{ padding: "13px 16px" }}>
                      <p style={{ fontSize: 13, color: "#e0e0e0", fontWeight: 500, maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</p>
                      <p style={{ fontSize: 11, color: "#444", marginTop: 1 }}>{c.objective}</p>
                    </td>
                    <td style={{ padding: "13px 16px" }}><StatusBadge status={c.status} /></td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: "#666", whiteSpace: "nowrap" }}>{c.platform}</td>
                    <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#aaa" }}>${c.budget.toLocaleString()}</td>
                    <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#ccc", fontWeight: 500 }}>${c.spent.toLocaleString()}</td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: "#888" }}>{(c.impressions / 1000).toFixed(0)}k</td>
                    <td style={{ padding: "13px 16px", fontSize: 12.5, color: c.ctr > 3 ? "#22c55e" : "#aaa" }}>{c.ctr}%</td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: "#888" }}>${c.cpc}</td>
                    <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#ccc" }}>{c.conversions}</td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: c.cpa < 4 ? "#22c55e" : "#f59e0b" }}>${c.cpa}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: c.roas >= 4 ? "#22c55e" : c.roas >= 2 ? "#f59e0b" : "#ef4444" }}>
                        {c.roas}x
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#22c55e", fontWeight: 500 }}>
                      ${c.revenue.toLocaleString("es-MX", { maximumFractionDigits: 0 })}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: c.trendUp ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
                        {c.trendUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {c.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Campaign Detail (when selected) */}
        {selected && (
          <div
            className="fade-in"
            style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, padding: "24px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600 }}>{campaign.name}</h3>
                <p style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                  {campaign.startDate} → {campaign.endDate} · {campaign.platform}
                </p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "7px 14px", color: "#ccc", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  {campaign.status === "active" ? <Pause size={13} /> : <Play size={13} />}
                  {campaign.status === "active" ? "Pausar" : "Reactivar"}
                </button>
                <button style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "7px 14px", color: "#3b82f6", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <ExternalLink size={13} />
                  Ver en Meta
                </button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
              {[
                { label: "Impresiones", value: campaign.impressions.toLocaleString() },
                { label: "Alcance", value: campaign.reach.toLocaleString() },
                { label: "Clics", value: campaign.clicks.toLocaleString() },
                { label: "CTR", value: `${campaign.ctr}%`, highlight: campaign.ctr > 3 },
                { label: "Conversiones", value: campaign.conversions },
                { label: "ROAS", value: `${campaign.roas}x`, highlight: true },
              ].map((m, i) => (
                <div key={i} style={{ background: "#0d0d0d", borderRadius: 8, padding: "12px 14px", border: "1px solid #1a1a1a" }}>
                  <p style={{ fontSize: 11, color: "#555", marginBottom: 5 }}>{m.label}</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: m.highlight ? "#22c55e" : "#fff" }}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Budget Progress */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#555" }}>Presupuesto utilizado</span>
                <span style={{ fontSize: 12, color: "#ccc" }}>
                  ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                  <span style={{ color: "#555", marginLeft: 6 }}>({((campaign.spent / campaign.budget) * 100).toFixed(0)}%)</span>
                </span>
              </div>
              <div style={{ height: 6, background: "#1a1a1a", borderRadius: 3, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${(campaign.spent / campaign.budget) * 100}%`,
                    background: campaign.spent / campaign.budget > 0.85 ? "#f59e0b" : "#3b82f6",
                    borderRadius: 3,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
