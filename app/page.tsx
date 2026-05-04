"use client";
import { useState, useEffect } from "react";

const categories = ["مشروع تقليدي", "تجارة إلكترونية", "SaaS", "فريلانس", "استثمار"];
const budgets = ["0$ – 100$", "100$ – 500$", "500$ – 2,000$", "2,000$+"];
const skills = ["برمجة", "تصميم", "تسويق", "كتابة", "مبيعات", "لا شيء محدد"];

type Idea = {
  title: string;
  problem: string;
  market: string;
  revenue: string;
  risk: string;
  score: number;
  growth: string;
};

function ScoreRing({ score }: { score: number }) {
  const r = 28, c = 2 * Math.PI * r;
  const fill = (score / 10) * c;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
      <circle cx="36" cy="36" r={r} fill="none" stroke="url(#sg)" strokeWidth="4"
        strokeDasharray={`${fill} ${c}`} strokeLinecap="round"
        transform="rotate(-90 36 36)" />
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <text x="36" y="36" textAnchor="middle" dominantBaseline="central"
        fill="white" fontSize="14" fontWeight="700">{score}</text>
    </svg>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        position: "relative",
        padding: "10px 14px",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "Cairo, sans-serif",
        cursor: "pointer",
        transition: "all 0.2s",
        background: active ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${active ? "rgba(139,92,246,0.7)" : "rgba(255,255,255,0.08)"}`,
        color: active ? "#c4b5fd" : "rgba(255,255,255,0.38)",
        boxShadow: active ? "0 0 20px rgba(139,92,246,0.15)" : "none",
      }}>
      {label}
    </button>
  );
}

function IdeaCard({ idea, index }: { idea: Idea; index: number }) {
  const riskMap: Record<string, { color: string; bg: string }> = {
    "منخفض": { color: "#34d399", bg: "rgba(52,211,153,0.1)" },
    "متوسط": { color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
    "عالي":  { color: "#f87171", bg: "rgba(248,113,113,0.1)" },
  };
  const risk = riskMap[idea.risk] ?? { color: "#a78bfa", bg: "rgba(167,139,250,0.1)" };

  return (
    <div style={{
      position: "relative",
      borderRadius: 20,
      padding: "24px",
      border: "1px solid rgba(255,255,255,0.07)",
      background: "rgba(255,255,255,0.025)",
      animation: `fadeUp 0.5s ease ${index * 120}ms both`,
      transition: "border-color 0.3s",
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 18 }}>
        <ScoreRing score={idea.score} />
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 6 }}>
            <span style={{
              fontSize: 11, fontWeight: 600,
              padding: "3px 10px", borderRadius: 99,
              background: risk.bg, color: risk.color,
            }}>
              خطورة {idea.risk}
            </span>
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{idea.title}</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.7 }}>{idea.problem}</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { label: "السوق المستهدف", val: idea.market },
          { label: "نموذج الربح",    val: idea.revenue },
        ].map(({ label, val }) => (
          <div key={label} style={{
            borderRadius: 12, padding: "12px 14px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Growth */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.32)" }}>
        <span style={{ color: "#a78bfa" }}>↗</span>
        {idea.growth}
      </div>
      <button onClick={() => window.location.href = `/idea/${index}`}
        style={{ marginTop: 14, width: "100%", padding: "10px", borderRadius: 12, border: "1px solid rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.1)", color: "#a78bfa", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "Cairo, sans-serif" }}>
        عرض خطة التنفيذ الكاملة ←
      </button>
    </div>
  );
}

export default function Home() {
  const [country, setCountry]   = useState("");
  const [budget, setBudget]     = useState("");
  const [skill, setSkill]       = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading]   = useState(false);
  const [ideas, setIdeas]       = useState<Idea[]>([]);
  const [error, setError]       = useState("");
  const [dots, setDots]         = useState(".");

  useEffect(() => {
    if (!loading) return;
    const iv = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 450);
    return () => clearInterval(iv);
  }, [loading]);

  async function generate() {
    if (!country || !budget || !skill || !category) {
      setError("يرجى ملء جميع الحقول أولاً"); return;
    }
    setError(""); setLoading(true); setIdeas([]);

    const prompt = `أنت مستشار أعمال واستثمار خبير.
معلومات المستخدم:
- البلد: ${country}
- الميزانية: ${budget}
- مهاراته: ${skill}
- نوع المشروع: ${category}

ولّد 3 أفكار مشاريع مناسبة. أجب فقط بـ JSON بدون أي نص إضافي:
{"ideas":[{"title":"","problem":"","market":"","revenue":"","risk":"منخفض|متوسط|عالي","score":8.5,"growth":""}]}`;

    try {
      const res = await fetch("/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ country, budget, skill, category }),
});
const parsed = await res.json();
const ideas = parsed.ideas ?? [];
setIdeas(ideas);
localStorage.setItem("ideas", JSON.stringify(ideas));
    } catch {
      setError("حدث خطأ أثناء التوليد، حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  const ready = country && budget && skill && category;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #08080f; font-family: 'Cairo', sans-serif; }
        ::selection { background: rgba(139,92,246,0.35); }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:focus { outline: none; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 30px rgba(124,58,237,0.3); }
          50%      { box-shadow: 0 0 60px rgba(124,58,237,0.55), 0 0 100px rgba(124,58,237,0.15); }
        }

        .hero-title {
          background: linear-gradient(135deg, #ffffff 25%, #a78bfa 60%, #f59e0b 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 6s linear infinite;
        }
        .spin { animation: spin 0.85s linear infinite; }
        .float { animation: float 4s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.6s ease both; }
        .cta-glow { animation: pulseGlow 2.5s ease infinite; }

        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px;
          padding: 13px 16px;
          font-size: 14px;
          color: #fff;
          font-family: 'Cairo', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          border-color: rgba(139,92,246,0.65);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.08);
        }

        .stat-pill {
          border-radius: 12px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
        }
      `}</style>

      <main dir="rtl" style={{ minHeight: "100vh", background: "#08080f", color: "#fff", overflowX: "hidden" }}>

        {/* Ambient blobs */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div className="float" style={{
            position: "absolute", top: "-20%", right: "-15%",
            width: 700, height: 700, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(109,40,217,0.2) 0%, transparent 65%)",
          }} />
          <div style={{
            position: "absolute", bottom: "-15%", left: "-10%",
            width: 550, height: 550, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 65%)",
          }} />
          <div style={{
            position: "absolute", top: "40%", left: "30%",
            width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)",
          }} />
          {/* Grid lines */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.025 }}>
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Header */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(8,8,15,0.75)",
          backdropFilter: "blur(20px)",
          padding: "0 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 62,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 17, boxShadow: "0 0 24px rgba(124,58,237,0.45)",
            }}>✦</div>
            <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: "-0.02em" }}>فكرة <span style={{ color: "#a78bfa" }}>AI</span></span>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.3)",
            border: "1px solid rgba(255,255,255,0.07)",
            padding: "4px 14px", borderRadius: 99,
            background: "rgba(255,255,255,0.03)",
          }}>نسخة تجريبية</div>
        </header>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", padding: "64px 20px 100px" }}>

          {/* Hero */}
          <div className="fade-up" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              fontSize: 12, fontWeight: 600, color: "#a78bfa",
              border: "1px solid rgba(167,139,250,0.3)",
              background: "rgba(167,139,250,0.08)",
              padding: "5px 16px", borderRadius: 99, marginBottom: 24,
              backdropFilter: "blur(8px)",
            }}>
              ✦ مدعوم بـ Claude Sonnet
            </div>

            <h1 className="hero-title" style={{
              fontSize: "clamp(34px, 6.5vw, 56px)",
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: "-0.035em",
              marginBottom: 18,
            }}>
              اكتشف فكرة مشروعك<br />بالذكاء الاصطناعي
            </h1>

            <p style={{
              fontSize: 16, color: "rgba(255,255,255,0.4)",
              maxWidth: 420, margin: "0 auto", lineHeight: 1.9,
            }}>
              أدخل معلوماتك وسيولّد لك الذكاء الاصطناعي
              أفكار مشاريع مناسبة تماماً لك
            </p>
          </div>

          {/* Stats bar */}
          <div className="fade-up" style={{
            display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10,
            marginBottom: 28,
          }}>
            {[
              { n: "+500", label: "فكرة مولّدة" },
              { n: "3",    label: "أفكار لكل طلب" },
              { n: "10",   label: "معايير تقييم" },
            ].map(({ n, label }) => (
              <div key={label} style={{
                textAlign: "center", padding: "14px 10px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#a78bfa", marginBottom: 2 }}>{n}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="fade-up" style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: "32px 28px",
            marginBottom: 24,
            backdropFilter: "blur(12px)",
          }}>

            {/* Country */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.35)", display: "block", marginBottom: 8, letterSpacing: "0.04em" }}>
                البلد
              </label>
              <input type="text" className="input-field"
                placeholder="مثال: الجزائر، المغرب، السعودية..."
                value={country}
                onChange={e => setCountry(e.target.value)}
              />
            </div>

            {/* Budget */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.35)", display: "block", marginBottom: 8, letterSpacing: "0.04em" }}>
                الميزانية المتاحة
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {budgets.map(b => <Chip key={b} label={b} active={budget === b} onClick={() => setBudget(b)} />)}
              </div>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.35)", display: "block", marginBottom: 8, letterSpacing: "0.04em" }}>
                مهاراتك
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {skills.map(s => <Chip key={s} label={s} active={skill === s} onClick={() => setSkill(s)} />)}
              </div>
            </div>

            {/* Category */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.35)", display: "block", marginBottom: 8, letterSpacing: "0.04em" }}>
                نوع المشروع
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {categories.map(c => <Chip key={c} label={c} active={category === c} onClick={() => setCategory(c)} />)}
              </div>
            </div>

            {error && (
              <p style={{ textAlign: "center", fontSize: 13, color: "#f87171", marginBottom: 16 }}>{error}</p>
            )}

            {/* CTA Button */}
            <button onClick={generate} disabled={loading}
              className={ready && !loading ? "cta-glow" : ""}
              style={{
                width: "100%",
                padding: "16px 24px",
                borderRadius: 16,
                border: "none",
                fontSize: 15,
                fontWeight: 800,
                fontFamily: "Cairo, sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                color: "#fff",
                background: ready && !loading
                  ? "linear-gradient(135deg, #7c3aed 0%, #4338ca 50%, #7c3aed 100%)"
                  : "rgba(255,255,255,0.06)",
                backgroundSize: "200%",
                transition: "all 0.3s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                letterSpacing: "0.01em",
              }}>
              {loading ? (
                <>
                  <svg className="spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                    <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  الذكاء الاصطناعي يفكر{dots}
                </>
              ) : (
                <>✦&nbsp; ولّد أفكار مشاريع</>
              )}
            </button>
          </div>

          {/* Results */}
          {ideas.length > 0 && (
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                marginBottom: 18, fontSize: 12, color: "rgba(255,255,255,0.22)",
              }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
                {ideas.length} أفكار مقترحة لك
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {ideas.map((idea, i) => <IdeaCard key={i} idea={idea} index={i} />)}
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}