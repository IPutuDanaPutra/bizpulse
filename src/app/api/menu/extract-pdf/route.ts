import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import OpenAI from "openai";
import { EXTRACT_SYSTEM_PROMPT } from "@/lib/menu-extract-prompt";

export async function POST(req: Request) {
  const { apiKey, fileBase64 } = (await req.json()) as { apiKey: string; fileBase64: string };
  if (!apiKey || !fileBase64) {
    return NextResponse.json({ error: "Missing apiKey or file" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(fileBase64, "base64");
    const parser = new PDFParse({ data: buffer });
    const { text } = await parser.getText();

    const deepseek = new OpenAI({ apiKey, baseURL: "https://api.deepseek.com" });
    const completion = await deepseek.chat.completions.create({
      model: "deepseek-v4-flash",
      messages: [
        { role: "system", content: EXTRACT_SYSTEM_PROMPT },
        { role: "user", content: `Teks berikut diekstrak dari PDF menu/katalog produk:\n\n${text.slice(0, 8000)}` },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    return NextResponse.json(JSON.parse(raw));
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Gagal membaca PDF" }, { status: 500 });
  }
}
