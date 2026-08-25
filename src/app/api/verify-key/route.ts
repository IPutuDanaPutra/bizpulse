import { NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { apiKey } = (await req.json()) as { apiKey: string };
  if (!apiKey) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const deepseek = createOpenAI({ apiKey, baseURL: "https://api.deepseek.com" });
    await generateText({
      model: deepseek("deepseek-v4-flash"),
      prompt: "Balas dengan satu kata: ok",
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
