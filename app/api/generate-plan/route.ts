import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "أنت مساعد خبير في الأعمال. أجب دائماً باللغة العربية، ولكن اكتب أسماء الشركات والأدوات والتطبيقات بالإنجليزية كما هي." },
        { role: "user", content: prompt }
     ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  const clean = text.replace(/```json|```/g, "").trim();

  try {
    return NextResponse.json(JSON.parse(clean));
  } catch {
    return NextResponse.json({ error: "فشل" }, { status: 500 });
  }
}