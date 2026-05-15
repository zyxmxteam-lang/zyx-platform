"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, AlignLeft, AlignCenter, Link, Star, Download, MoreHorizontal } from "lucide-react";
import { ZYXLogoFull } from "@/components/ZYXLogo";

const SAMPLE_CONTENT = `<h1>Estrategia de Marketing Q2 2025</h1>

<h2>Objetivos</h2>
<ul>
  <li>Alcanzar $30k en ingresos mensuales</li>
  <li>ROAS mínimo de 4x en todas las campañas</li>
  <li>Reducir CPA a menos de $3.00</li>
</ul>

<h2>Canales Prioritarios</h2>
<ol>
  <li><strong>Meta Ads</strong> — Budget: $6,000/mes</li>
  <li><strong>Email Marketing</strong> — Automatización de flujos</li>
  <li><strong>Organic Social</strong> — 3 posts/semana</li>
</ol>

<h2>KPIs de Seguimiento</h2>
<ul>
  <li>ROAS semanal</li>
  <li>CTR por creativo</li>
  <li>CPA por audiencia</li>
</ul>

<p>Empieza a escribir aquí para editar el documento. Selecciona texto para aplicar formato usando la barra de herramientas.</p>`;

export default function DocEditorPage() {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("Estrategia de Marketing Q2 2025");
  const [emoji, setEmoji] = useState("🎯");
  const [saved, setSaved] = useState(true);
  const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const EMOJIS = ["📄", "🎯", "🎨", "📋", "🔍", "📊", "💡", "🚀", "⭐", "✅", "📌", "🏆", "💬", "📈", "🛠️", "🔥"];

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  };

  const handleInput = useCallback(() => {
    setSaved(false);
    if (saveTimer) clearTimeout(saveTimer);
    const timer = setTimeout(() => {
      setSaved(true);
    }, 1500);
    setSaveTimer(timer);

    const text = editorRef.current?.innerText ?? "";
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
  }, [saveTimer]);

  const ToolbarBtn = ({ onClick, children, title }: { onClick: () => void; children: React.ReactNode; title: string }) => (
    <button
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#888",
        padding: "5px 7px",
        borderRadius: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.1s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#222"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "#888"; }}
    >
      {children}
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#080808" }}>
      {/* Top Bar */}
      <div
        style={{
          height: 52,
          background: "#0d0d0d",
          borderBottom: "1px solid #1c1c1c",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 12,
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => router.push("/docs")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#555", display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "5px 8px", borderRadius: 6 }}
        >
          <ArrowLeft size={14} /> Docs
        </button>

        <div style={{ width: 1, height: 20, background: "#222" }} />

        <ZYXLogoFull size={20} />

        <div style={{ width: 1, height: 20, background: "#222" }} />

        {/* Emoji picker */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, lineHeight: 1 }}
          >
            {emoji}
          </button>
          {showEmojiPicker && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "10px", zIndex: 100, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4 }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => { setEmoji(e); setShowEmojiPicker(false); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 4, borderRadius: 5 }}>
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={e => { setTitle(e.target.value); setSaved(false); }}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e0e0e0", fontSize: 15, fontWeight: 600, minWidth: 0 }}
          placeholder="Sin título"
        />

        {/* Save status */}
        <span style={{ fontSize: 11.5, color: saved ? "#444" : "#f59e0b", whiteSpace: "nowrap" }}>
          {saved ? "Guardado" : "Guardando..."}
        </span>

        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#555", display: "flex" }}>
          <Star size={15} />
        </button>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#555", display: "flex" }}>
          <Download size={15} />
        </button>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#555", display: "flex" }}>
          <MoreHorizontal size={15} />
        </button>
      </div>

      {/* Formatting Toolbar */}
      <div
        style={{
          background: "#0d0d0d",
          borderBottom: "1px solid #171717",
          padding: "4px 20px",
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexShrink: 0,
          flexWrap: "wrap",
        }}
      >
        <ToolbarBtn onClick={() => exec("bold")} title="Negrita (Ctrl+B)"><Bold size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec("italic")} title="Cursiva (Ctrl+I)"><Italic size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec("underline")} title="Subrayado (Ctrl+U)"><Underline size={14} /></ToolbarBtn>
        <div style={{ width: 1, height: 18, background: "#222", margin: "0 4px" }} />
        <ToolbarBtn onClick={() => exec("formatBlock", "h1")} title="Título 1"><Heading1 size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec("formatBlock", "h2")} title="Título 2"><Heading2 size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec("formatBlock", "p")} title="Párrafo"><AlignLeft size={14} /></ToolbarBtn>
        <div style={{ width: 1, height: 18, background: "#222", margin: "0 4px" }} />
        <ToolbarBtn onClick={() => exec("insertUnorderedList")} title="Lista"><List size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec("insertOrderedList")} title="Lista numerada"><ListOrdered size={14} /></ToolbarBtn>
        <div style={{ width: 1, height: 18, background: "#222", margin: "0 4px" }} />
        <ToolbarBtn onClick={() => exec("justifyLeft")} title="Alinear izquierda"><AlignLeft size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec("justifyCenter")} title="Centrar"><AlignCenter size={14} /></ToolbarBtn>
        <div style={{ width: 1, height: 18, background: "#222", margin: "0 4px" }} />
        <ToolbarBtn
          onClick={() => {
            const url = prompt("URL del enlace:");
            if (url) exec("createLink", url);
          }}
          title="Insertar enlace"
        >
          <Link size={14} />
        </ToolbarBtn>

        <div style={{ marginLeft: "auto", fontSize: 11, color: "#333" }}>
          {wordCount} palabras
        </div>
      </div>

      {/* Editor Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#080808",
          display: "flex",
          justifyContent: "center",
          padding: "40px 20px 80px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 780 }}>
          {/* Page */}
          <div
            style={{
              background: "#111",
              border: "1px solid #1c1c1c",
              borderRadius: 12,
              padding: "60px 72px",
              minHeight: 800,
            }}
          >
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              dangerouslySetInnerHTML={{ __html: SAMPLE_CONTENT }}
              style={{
                outline: "none",
                color: "#e0e0e0",
                fontSize: 15,
                lineHeight: 1.8,
                fontFamily: "inherit",
                minHeight: 680,
              }}
            />
          </div>

          {/* Footer info */}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 16 }}>
            <span style={{ fontSize: 11, color: "#2a2a2a" }}>Última edición: DS · Hoy</span>
            <span style={{ fontSize: 11, color: "#2a2a2a" }}>ZYX Internal Docs</span>
          </div>
        </div>
      </div>

      {/* Editor Styles */}
      <style>{`
        [contenteditable] h1 { font-size: 28px; font-weight: 700; color: #fff; margin: 0 0 8px; letter-spacing: -0.02em; }
        [contenteditable] h2 { font-size: 20px; font-weight: 600; color: #e0e0e0; margin: 24px 0 8px; }
        [contenteditable] h3 { font-size: 16px; font-weight: 600; color: #ccc; margin: 20px 0 6px; }
        [contenteditable] p { margin: 0 0 12px; }
        [contenteditable] ul, [contenteditable] ol { padding-left: 24px; margin: 0 0 12px; }
        [contenteditable] li { margin-bottom: 4px; color: #ccc; }
        [contenteditable] strong { color: #fff; font-weight: 600; }
        [contenteditable] em { color: #aaa; font-style: italic; }
        [contenteditable] a { color: #3b82f6; text-decoration: underline; }
        [contenteditable] blockquote { border-left: 3px solid #333; padding-left: 16px; color: #666; margin: 12px 0; }
        [contenteditable]:focus { outline: none; }
      `}</style>
    </div>
  );
}
