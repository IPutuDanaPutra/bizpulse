import { NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, APICallError } from "ai";

export async function POST(req: Request) {
  const { apiKey } = (await req.json()) as { apiKey: string };
  if (!apiKey) return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });

  try {
    const deepseek = createOpenAI({ apiKey, baseURL: "https://api.deepseek.com" });
    await generateText({
      model: deepseek("deepseek-v4-flash"),
      prompt: "Balas dengan satu kata: ok",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Distinguish "the key itself is wrong" (401/403 from the provider) from
    // "we couldn't reach the provider at all" — the two get different, honest copy on the client.
    const status = err instanceof APICallError ? err.statusCode : undefined;
    const reason = status === 401 || status === 403 ? "invalid" : "network";
    return NextResponse.json({ ok: false, reason }, { status: reason === "invalid" ? 401 : 502 });
  }
}
