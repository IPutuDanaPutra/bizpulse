"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { ScrollFade } from "@/components/scroll-fade";
import { ThinkingTrace } from "@/components/thinking-trace";
import { ContextCard } from "@/components/context-card";
import { Send, MessageSquare } from "lucide-react";
import { findMentionedProduct } from "@/lib/find-mentioned-product";
import { pickFollowUps, CHAT_STARTERS } from "@/lib/follow-up-chips";
import type { BusinessProfile, HolidayEntry, MenuItem, WeatherDay } from "@/lib/types";

const CHAT_THINKING_STEPS = ["Membaca konteks bisnis", "Menyusun jawaban"];

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
  const lastReplyText =
    lastMessage?.role === "assistant" ? lastMessage.parts.map((p) => (p.type === "text" ? p.text : "")).join("") : "";
  const showFollowUps = lastMessage?.role === "assistant" && !isStreaming && lastReplyText.length > 0;
  const followUps = showFollowUps ? pickFollowUps(lastReplyText, menuItems) : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-[440px]">
        <SheetHeader className="border-b">
          <SheetTitle>{profile.businessName}</SheetTitle>
          <SheetDescription>Tanya apa saja soal rekomendasi hari ini.</SheetDescription>
        </SheetHeader>

        <ScrollFade className="min-h-0 flex-1" contentClassName="flex h-full flex-col gap-4 p-4">
          {!apiKey ? (
            <EmptyState icon={MessageSquare} headline="Belum bisa chat" body="Tambahkan API key di Pengaturan dulu." />
          ) : messages.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              headline="Tanya apa aja soal rekomendasi hari ini"
              action={
                <div className="flex flex-wrap justify-center gap-1.5">
                  {CHAT_STARTERS.map((q) => (
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
              }
            />
          ) : (
            messages.map((m, i) => {
              const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              const isLast = i === messages.length - 1;
              const isThisStreaming = isStreaming && isLast && m.role === "assistant";
              const mentioned = m.role === "assistant" ? findMentionedProduct(text, menuItems) : null;

              if (m.role === "user") {
                return (
                  <div key={m.id} className="ml-auto max-w-[75%] rounded-2xl bg-muted px-3 py-2 text-sm">
                    {text}
                  </div>
                );
              }

              // AI replies: no bubble background — plain text on the panel, so it reads as the panel
              // talking to you rather than a boxed-in message (v9 §2.4).
              return (
                <div key={m.id} className="flex max-w-[90%] flex-col gap-2">
                  {isThisStreaming && text.length === 0 ? (
                    <ThinkingTrace steps={CHAT_THINKING_STEPS} label="Menyusun jawaban..." />
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <span className="ai-chip w-fit">AI</span>
                      <p className="text-sm">{text}</p>
                    </div>
                  )}
                  {mentioned && <ContextCard item={mentioned} />}
                </div>
              );
            })
          )}

          {followUps.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {followUps.map((q) => (
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
        </ScrollFade>

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
            placeholder={apiKey ? "Tanya sesuatu..." : "Butuh API key dulu"}
            disabled={!apiKey}
            className="rounded-full"
          />
          <Button
            type="submit"
            size="icon-sm"
            className="rounded-full text-[var(--primary-foreground)]"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-warm))" }}
            disabled={!apiKey || !input.trim() || isStreaming}
          >
            <Send className="size-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
