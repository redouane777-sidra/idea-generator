"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Idea = {
  title: string;
  problem: string;
  market: string;
  revenue: string;
  risk: string;
  score: number;
  growth: string;
};

type DetailPlan = {
  steps: { week: string; tasks: string[] }[];
  tools: string[];
  competitors: string[];
  monthlyRevenue: string;
  firstActions: string[];
};

export default function IdeaDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [plan, setPlan] = useState<DetailPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const stored = localStorage.getItem("ideas");
    if (stored) {
      const ideas: Idea[] = JSON.parse(stored);
      const index = parseInt(id as string);
      if (ideas[index]) setIdea(ideas[index]);
    }
  }, [id]);

  useEffect(() => {
    if (!loading) return;
    const iv = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 450);
    return () => clearInterval(iv);
  }, [loading]);

  useEffect(() => {
    if (idea) generatePlan();
  }, [idea]);

  async function generatePlan() {
    if (!idea) return;
    setLoading(true);
    const prompt = `أنت مستشار أعمال خبير. قدّم خطة تنفيذ مفصّلة لهذه الفكرة: "${idea.title}".

أجب فقط بـ JSON بدون أي نص إضافي:
{
  "steps": [
    {"week": "الأسبوع 1", "tasks": ["مهمة 1", "مهمة 2", "مهمة 3"]},
    {"week": "الأسبوع 2", "tasks": ["مهمة 1", "مهمة 2", "مهمة 3"]},
    {"week": "الأسبوع 3-4", "tasks": ["مهمة 1", "مهمة 2", "مهمة 3"]},
    {"week": "الشهر 2-3", "tasks": ["مهمة 1", "مهمة 2", "مهمة 3"]}
  ],
  "tools": ["أداة 1", "أداة 2", "أداة 3", "أداة 4"],
  "competitors": ["منافس 1", "منافس 2", "منافس 3"],
  "monthlyRevenue": "500$ - 2000$ بعد 3 أشهر",
  "firstActions": ["أول خطوة تفعلها غداً", "ثاني خطوة", "ثالث خطوة"]
}`;

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setPlan(data);
    } catch {
      console.error("فشل التحميل");
    } finally {
      setLoading(false);
    }
  }

  const riskColor: Record<string, string> = {
    "منخفض": "#34d399",
    "متوسط": "#fbbf24",
    "عالي": "#f87171",
  };

  if (!idea) return (
    <main dir="rtl" style={{ minHeight: "100vh", background: "#08080f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Cairo, sans-serif" }}>جاري التحميل...</p>
    </main>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #08080f; font-family: 'Cairo', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position:200% center; } 100% { background-position:-200% center; } }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .spin { animation: spin 0.85s linear infinite; }
        .card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 14px;
          animation: fadeUp 0.5s ease both;
        }
        .card:hover { border-color: rgba(139,92,246,0.25); transition: border-color 0.3s; }
        .section-title {
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.08em;
          margin-bottom: 16px;
          text-transform: uppercase;
        }
        .tag {
          display: inline-flex;
          align-items: center;
          font-size: 12px;
          padding: 5px 12px;
          border-radius: 99px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.6);
          margin: 4px;
        }
        .task-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 14px;
          color: rgba(255,255,255,0.7);
        }
        .task-item:last-child { border-bottom: none; }
        .check { width: 18px; height: 18px; border-radius: 50%; background: rgba(139,92,246,0.2); border: 1.5px solid rgba(139,92,246,0.5); flex-shrink: 0; margin-top: 2px; }
        .week-label {
          font-size: 12px;
          font-weight: 700;
          color: #a78bfa;
          margin-bottom: 10px;
          padding: 3px 10px;
          background: rgba(139,92,246,0.1);
          border-radius: 6px;
          display: inline-block;
        }
        .action-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          margin-bottom: 8px;
          font-size: 14px;
          color: rgba(255,255,255,0.8);
        }
        .action-num {
          width: 26px; height: 26px; border-radius: 50%;
          background: linear-gradient(135deg,#7c3aed,#4f46e5);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; flex-shrink: 0;
        }
      `}</style>

      <main dir="rtl" style={{ minHeight: "100vh", background: "#08080f", color: "#fff" }}>

        {/* Blobs */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-20%", right: "-15%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(109,40,217,0.15) 0%, transparent 65%)" }} />
        </div>

        {/* Header */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(8,8,15,0.8)", backdropFilter: "blur(20px)",
          padding: "0 28px", display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 62,
        }}>
          <button onClick={() => router.back()}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 14, fontFamily: "Cairo, sans-serif" }}>
            → رجوع
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>✦</div>
            <span style={{ fontWeight: 900, fontSize: 17 }}>فكرة <span style={{ color: "#a78bfa" }}>AI</span></span>
          </div>
        </header>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "48px 20px 80px" }}>

          {/* Idea Hero */}
          <div className="fade-up" style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{
                fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 99,
                background: `${riskColor[idea.risk]}18`, color: riskColor[idea.risk] ?? "#a78bfa",
                border: `1px solid ${riskColor[idea.risk]}40`,
              }}>خطورة {idea.risk}</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", padding: "4px 12px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.08)" }}>
                التقييم: {idea.score}/10
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, lineHeight: 1.2,
              marginBottom: 12, letterSpacing: "-0.025em",
              background: "linear-gradient(135deg,#fff 40%,#a78bfa 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>{idea.title}</h1>

            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.8 }}>{idea.problem}</p>
          </div>

          {/* Quick stats */}
          <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
            {[
              { label: "السوق المستهدف", val: idea.market, icon: "🎯" },
              { label: "نموذج الربح",    val: idea.revenue, icon: "💰" },
              { label: "مسار النمو",     val: idea.growth,  icon: "↗" },
              { label: "مستوى الخطورة", val: idea.risk,    icon: "⚡" },
            ].map(({ label, val, icon }) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "16px" }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <svg className="spin" width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ margin: "0 auto 16px" }}>
                <circle cx="16" cy="16" r="12" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                <path d="M16 4a12 12 0 0 1 12 12" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>الذكاء الاصطناعي يبني خطتك{dots}</p>
            </div>
          )}

          {plan && (
            <>
              {/* First actions */}
              <div className="card" style={{ animationDelay: "0ms" }}>
                <div className="section-title">✦ أول 3 خطوات تفعلها غداً</div>
                {plan.firstActions.map((action, i) => (
                  <div key={i} className="action-item">
                    <div className="action-num">{i + 1}</div>
                    {action}
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div className="card" style={{ animationDelay: "100ms" }}>
                <div className="section-title">📅 خطة التنفيذ الأسبوعية</div>
                {plan.steps.map((step, i) => (
                  <div key={i} style={{ marginBottom: i < plan.steps.length - 1 ? 20 : 0 }}>
                    <div className="week-label">{step.week}</div>
                    {step.tasks.map((task, j) => (
                      <div key={j} className="task-item">
                        <div className="check" />
                        {task}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Tools + Competitors */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="card" style={{ animationDelay: "200ms" }}>
                  <div className="section-title">🛠 الأدوات المطلوبة</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {plan.tools.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
                <div className="card" style={{ animationDelay: "250ms" }}>
                  <div className="section-title">⚔ المنافسون</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {plan.competitors.map(c => <span key={c} className="tag">{c}</span>)}
                  </div>
                </div>
              </div>

              {/* Revenue */}
              <div className="card" style={{ animationDelay: "300ms", textAlign: "center", padding: "32px" }}>
                <div className="section-title" style={{ marginBottom: 10 }}>💵 التوقع المالي</div>
                <div style={{
                  fontSize: "clamp(22px,4vw,32px)", fontWeight: 900,
                  background: "linear-gradient(135deg,#34d399,#a78bfa)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>{plan.monthlyRevenue}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>دخل شهري متوقع</div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}