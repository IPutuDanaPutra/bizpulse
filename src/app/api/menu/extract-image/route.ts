import { NextResponse } from "next/server";
import OpenAI from "openai";
import { EXTRACT_SYSTEM_PROMPT } from "@/lib/menu-extract-prompt";

// DeepSeek's vision-capable model — separate from the text-only deepseek-v4-flash used for the daily insight.
const VISION_MODEL = "deepseek-v4-flash-vision-exp";

export async function POST(req: Request) {
  const { apiKey, imageDataUrl } = (await req.json()) as { apiKey: string; imageDataUrl: string };
  if (!apiKey || !imageDataUrl) {
    return NextResponse.json({ error: "Missing apiKey or image" }, { status: 400 });
  }

  const deepseek = new OpenAI({ apiKey, baseURL: "https://api.deepseek.com" });

  try {
    const completion = await deepseek.chat.completions.create({
      model: VISION_MODEL,
      messages: [
        { role: "system", content: EXTRACT_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Ekstrak semua produk dan harga dari foto menu ini." },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    return NextResponse.json(JSON.parse(raw));
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Gagal membaca gambar menu" }, { status: 500 });
  }
}
