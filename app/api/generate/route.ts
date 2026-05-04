import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { country, budget, skill, category } = await req.json();

  const prompt = `أنت مستشار أعمال واستثمار خبير.
معلومات المستخدم:
- البلد: ${country}
- الميزانية: ${budget}
- مهاراته: ${skill}
- نوع المشروع: ${category}

ولّد 3 أفكار مشاريع مناسبة. أجب فقط بـ JSON بدون أي نص إضافي:
{"ideas":[{"title":"","problem":"","market":"","revenue":"","risk":"منخفض|متوسط|عالي","score":8.5,"growth":""}]}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  const clean = text.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "فشل التحليل" }, { status: 500 });
  }
}