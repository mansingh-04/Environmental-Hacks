"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { useVoice } from "@/features/voice/use-voice";
import { askFollowUp } from "@/features/waste/pipeline";
import type { ChatMessage, WasteAnalysis } from "@/types/waste";

const SUGGESTIONS = [
  "Can I recycle this?",
  "How much can I get for this?",
  "Where should I take it?",
  "Why is this harmful?",
  "What should I remove before recycling?",
];

let nextId = 0;
const message = (role: ChatMessage["role"], text: string): ChatMessage => ({ id: String(++nextId), role, text });

export function ChatSheet({ analysis, imageUrl, onClose }: { analysis: WasteAnalysis; imageUrl: string; onClose: () => void }) {
  const voice = useVoice();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    message("assistant", `Ask me anything about your ${analysis.identification.name}.`),
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => () => {
    voice?.stopSpeaking();
    voice?.stopListening();
  }, [voice]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || thinking) return;
    const userMessage = message("user", question);
    const history = [...messages, userMessage];
    setMessages(history);
    setInput("");
    setThinking(true);
    const reply = await askFollowUp(question, analysis, history);
    setMessages((m) => [...m, message("assistant", reply)]);
    setThinking(false);
    if (autoSpeak) voice?.speak(reply);
  }

  async function listen() {
    if (!voice) return;
    if (listening) return voice.stopListening();
    voice.stopSpeaking();
    setVoiceError("");
    setListening(true);
    try {
      const transcript = await voice.listen();
      if (transcript) await send(transcript);
    } catch {
      setVoiceError("Couldn't hear you — check microphone access, or type instead.");
    } finally {
      setListening(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end bg-ink/40 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-label="Ask CleanItUp"
        onClick={(e) => e.stopPropagation()}
        className="mx-auto flex h-[88dvh] w-full max-w-md flex-col rounded-t-[2rem] bg-canvas shadow-2xl animate-sheet-up"
      >
        <header className="flex items-center gap-3 border-b border-line px-4 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- local object URL */}
          <img src={imageUrl} alt="" className="size-10 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold leading-tight">{analysis.identification.name}</p>
            <p className="text-xs text-muted">{analysis.identification.category}</p>
          </div>
          {voice?.canSpeak && (
            <button
              onClick={() => {
                voice.stopSpeaking();
                setAutoSpeak((s) => !s);
              }}
              aria-label={autoSpeak ? "Mute voice replies" : "Read replies aloud"}
              aria-pressed={autoSpeak}
              className={`grid size-10 place-items-center rounded-full ${autoSpeak ? "bg-brand-soft text-brand-deep" : "text-muted"}`}
            >
              <Icon name={autoSpeak ? "volume" : "stop"} />
            </button>
          )}
          <button onClick={onClose} aria-label="Close chat" className="grid size-10 place-items-center rounded-full hover:bg-ink/5">
            <Icon name="close" />
          </button>
        </header>

        <div ref={scroller} className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
          {messages.map((m) => (
            <p
              key={m.id}
              className={`max-w-[85%] rounded-3xl px-4 py-3 leading-relaxed animate-rise [animation-duration:0.3s] ${
                m.role === "user" ? "self-end rounded-br-lg bg-brand-deep text-white" : "self-start rounded-bl-lg bg-surface ring-1 ring-line"
              }`}
            >
              {m.text}
            </p>
          ))}
          {thinking && (
            <p className="flex gap-1 self-start rounded-3xl rounded-bl-lg bg-surface px-4 py-4 ring-1 ring-line" aria-label="Thinking">
              {[0, 150, 300].map((d) => (
                <span key={d} className="size-2 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${d}ms` }} />
              ))}
            </p>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => send(s)} className="shrink-0 rounded-full bg-surface px-3 py-2 text-sm font-medium ring-1 ring-line">
              {s}
            </button>
          ))}
        </div>

        {voiceError && <p className="px-4 pb-2 text-sm text-danger">{voiceError}</p>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-line px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          {voice?.canListen && (
            <button
              type="button"
              onClick={listen}
              aria-label={listening ? "Stop listening" : "Ask by voice"}
              className={`grid size-12 shrink-0 place-items-center rounded-full transition ${listening ? "bg-lime text-brand-deep animate-pulse-ring" : "bg-surface ring-1 ring-line"}`}
            >
              <Icon name="mic" />
            </button>
          )}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? "Listening…" : "Ask a question…"}
            className="min-w-0 flex-1 rounded-full bg-surface px-4 py-3 text-base ring-1 ring-line outline-none focus:ring-2 focus:ring-brand"
          />
          <button type="submit" disabled={!input.trim() || thinking} aria-label="Send" className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-deep text-white disabled:opacity-40">
            <Icon name="send" className="size-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
