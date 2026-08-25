"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { Send, MessageSquare, Package } from "lucide-react";
import { findMentionedProduct } from "@/lib/find-mentioned-product";
import type { BusinessProfile, HolidayEntry, MenuItem, WeatherDay } from "@/lib/types";

const FOLLOW_UPS = ["Kenapa confidence-nya cuma segini?", "Bandingkan sama kemarin", "Ada rekomendasi lain?"];

export function ChatPanel({
  open,
  onOpenChange,
  apiKey,
  profile,
  today,
  holiday,
  menuItems,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: string | null;
  profile: BusinessProfile;
  today: WeatherDay | null;
  holiday: HolidayEntry | null;
  menuItems: MenuItem[];
}) {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { apiKey, weather: today, holiday, profile, menuItems },
    }),
  });

  const isStreaming = status === "submitted" || status === "streaming";

  function submit(text: string) {
    if (!text.trim() || !apiKey || !today) return;
    sendMessage({ text: text.trim() });
    setInput("");
  }

  const lastMessage = messages[messages.length - 1];
  const showFollowUps = lastMessage?.role === "assistant" && !isStreaming;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="size-4" /> Chat lebih lanjut
            <span className="ai-chip">AI</span>
          </SheetTitle>
          <SheetDescription>Tanya apa saja soal rekomendasi hari ini.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {!apiKey ? (
            <EmptyState
              icon={MessageSquare}
              headline="Belum bisa chat"
              body="Tambahkan API key di Pengaturan dulu."
            />
          ) : messages.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              headline="Belum ada percakapan"
              body="Mulai dengan tanya sesuatu soal rekomendasi hari ini."
            />
          ) : (
            messages.map((m, i) => {
              const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              const isLastStreaming = isStreaming && i === messages.length - 1 && m.role === "assistant";
              const mentioned = m.role === "assistant" ? findMentionedProduct(text, menuItems) : null;

              return (
                <div
                  key={m.id}
                  className={`flex flex-col gap-1 rounded-lg px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "ml-8 self-end bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : `mr-8 self-start bg-muted ${isLastStreaming ? "ai-processing-border" : ""}`
                  }`}
                >
                  <span>{text || (isLastStreaming ? "..." : "")}</span>
                  {mentioned && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Package className="size-3" /> Menyebut {mentioned.name} dari Menu & Produk kamu.
                    </span>
                  )}
                </div>
              );
            })
          )}
          {showFollowUps && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {FOLLOW_UPS.map((q) => (
                <Badge
                  key={q}
                  variant="outline"
                  className="cursor-pointer font-normal hover:bg-accent"
                  onClick={() => submit(q)}
                >
                  {q}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <form
          className="flex items-center gap-2 border-t p-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={apiKey ? "Tulis pertanyaan..." : "Butuh API key dulu"}
            disabled={!apiKey}
          />
          <Button type="submit" size="icon-sm" disabled={!apiKey || !input.trim() || isStreaming}>
            <Send className="size-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
