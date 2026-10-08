"use client";

import { ArrowUp, Mic, MicOff, Square, Volume2, VolumeX, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LanguageSelect } from "@/features/language/language-select";
import { activeLanguage, resolveTurnLanguage, useLanguageState } from "@/features/language/language-store";
import { Waveform } from "@/features/voice/waveform";
import { askFollowUp, detectLanguage } from "@/features/waste/pipeline";
import { LANGUAGES, type SupportedLanguage } from "@/lib/languages";
import { DURATION, EASE } from "@/lib/motion";
import { speechInput, speechOutput } from "@/providers";
import { SpeechInputError, type SpeechInputErrorKind } from "@/providers/speech/types";
import type { ConversationMessage } from "@/types/conversation";
import type { WasteAnalysis } from "@/types/waste";

const SUGGESTIONS = [
  "Can I recycle this?",
  "How much can I get for this?",
  "Where should I take it?",
  "Why is this harmful?",
  "What should I remove before recycling?",
];

const VOICE_ERRORS: Record<Exclude<SpeechInputErrorKind, "aborted">, string> = {
  denied: "Microphone access is blocked. Allow microphone access in your browser settings and try again.",
  unsupported: "Voice input isn't supported in this browser. Type your question instead.",
  "language-unsupported": "This language isn't supported for voice input in this browser yet. You can still type your question.",
  "no-speech": "I couldn't hear you. Try again.",
  "service-unavailable": "The speech service is unavailable right now. Try again, or type your question.",
};

/** Auto mode listens in Indian English (which also transcribes romanized Hinglish/Punjabi well) unless
 * the conversation is already in a native script; manual mode listens in the chosen language. */
function recognitionLocale(language: SupportedLanguage, script: "latin" | "native") {
  return script === "native" ? LANGUAGES[language].locale : "en-IN";
}

const enter = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: DURATION.base, ease: EASE } };

let nextId = 0;
const message = (role: ConversationMessage["role"], text: string, language?: SupportedLanguage): ConversationMessage => ({
  id: String(++nextId),
  role,
  text,
  language,
});

export function ChatSheet({ analysis, imageUrl, onClose }: { analysis: WasteAnalysis; imageUrl: string; onClose: () => void }) {
  const languageState = useLanguageState();
  const current = activeLanguage(languageState);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [voiceNote, setVoiceNote] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const status = listening ? "Listening" : thinking ? "Processing" : speaking ? "Speaking" : null;

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(
    () => () => {
      speechOutput.stop();
      speechInput.stop();
    },
    [],
  );

  async function send(text: string) {
    const question = text.trim();
    if (!question || thinking) return;
    setThinking(true);
    setInput("");
    // Speech → transcript → language → agent → reply in that language → voice in that language.
    const detection = await detectLanguage(question);
    const turn = resolveTurnLanguage(detection, detection.requested);
    const history = [...messages, message("user", question, detection.language)];
    setMessages(history);
    const reply = await askFollowUp(question, {
      analysis,
      language: turn.language,
      languageConfidence: turn.confidence,
      script: turn.script,
      messages: history,
    });
    setMessages((m) => [...m, message("assistant", reply, turn.language)]);
    setThinking(false);
    if (autoSpeak && speechOutput.isSupported()) {
      setSpeaking(true);
      const started = await speechOutput.speak(reply, turn.language, { script: turn.script, onEnd: () => setSpeaking(false) });
      if (!started) setSpeaking(false);
      // Text stays on screen; just say why it wasn't read aloud.
      setVoiceNote(started ? "" : `No ${LANGUAGES[turn.language].name} voice on this device — showing text only.`);
    }
  }

  async function listen() {
    setVoiceError("");
    if (!speechInput.isSupported()) return setVoiceError(VOICE_ERRORS.unsupported);
    speechOutput.stop();
    setSpeaking(false);
    setTranscript("");
    setListening(true);
    const locale = recognitionLocale(current.language, current.script);
    try {
      let heard: string;
      try {
        heard = await speechInput.listen({ locale, onTranscript: setTranscript });
      } catch (err) {
        // In Auto mode, fall back to Indian English if the browser can't recognise this locale.
        const retry = err instanceof SpeechInputError && err.kind === "language-unsupported" && languageState.mode === "auto" && locale !== "en-IN";
        if (!retry) throw err;
        heard = await speechInput.listen({ locale: "en-IN", onTranscript: setTranscript });
      }
      setListening(false);
      await send(heard);
    } catch (err) {
      setListening(false);
      const kind = err instanceof SpeechInputError ? err.kind : "service-unavailable";
      if (kind !== "aborted") setVoiceError(VOICE_ERRORS[kind]);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col justify-end bg-ink/40"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: DURATION.fast } }}
    >
      <motion.div
        role="dialog"
        aria-label={`Ask about ${analysis.identification.name}`}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: "100%" }}
        animate={{ y: 0, transition: { duration: DURATION.base, ease: EASE } }}
        exit={{ y: "100%", transition: { duration: DURATION.fast, ease: EASE } }}
        className="mx-auto flex h-[88dvh] w-full max-w-md flex-col rounded-t-xl bg-paper"
      >
        <header className="border-b border-line px-4 pt-3 pb-2">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- local object URL */}
            <img src={imageUrl} alt="" className="size-11 rounded-sm border border-line object-cover" />
            <div className="min-w-0 flex-1">
              <p className="label text-muted">Ask about</p>
              <p className="truncate text-[15px] font-semibold">{analysis.identification.name}</p>
            </div>
            <button onClick={onClose} aria-label="Close" className="grid size-11 place-items-center rounded-md transition hover:bg-ink/5 active:scale-90">
              <X className="size-5" />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={status ?? "idle"}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: DURATION.fast }}
                className={`label flex flex-1 items-center gap-1.5 whitespace-nowrap ${status ? "text-accent" : "text-faint"}`}
                aria-live="polite"
              >
                {(status === "Listening" || status === "Speaking") && <Waveform className="bg-accent" />}
                {status ?? (speechInput.isSupported() ? "Type or tap the mic" : "Type your question")}
              </motion.p>
            </AnimatePresence>
            <LanguageSelect compact showDetected />
            {speechOutput.isSupported() && (
              <button
                onClick={() => {
                  speechOutput.stop();
                  setSpeaking(false);
                  setAutoSpeak((s) => !s);
                }}
                aria-label={autoSpeak ? "Mute spoken replies" : "Read replies aloud"}
                aria-pressed={autoSpeak}
                className="grid size-9 place-items-center rounded-md border border-line text-muted transition hover:border-ink/30 active:scale-90"
              >
                {autoSpeak ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
              </button>
            )}
          </div>
        </header>

        <div ref={scroller} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5">
          {messages.length === 0 ? (
            <motion.ul {...enter} className="border-t border-line">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => send(s)}
                    className="flex w-full items-center justify-between border-b border-line py-3.5 text-left text-[15px] transition hover:text-accent active:bg-ink/5"
                  >
                    “{s}”
                    <ArrowUp className="size-4 rotate-45 text-faint" />
                  </button>
                </li>
              ))}
            </motion.ul>
          ) : (
            messages.map((m) =>
              m.role === "user" ? (
                <motion.p key={m.id} {...enter} lang={m.language} dir="auto" className="max-w-[80%] self-end rounded-lg rounded-br-sm bg-ink px-3.5 py-2.5 text-[15px] text-paper">
                  {m.text}
                </motion.p>
              ) : (
                <motion.p key={m.id} {...enter} lang={m.language} dir="auto" className="max-w-[92%] self-start border-material ps-3 [border-inline-start-width:2px] text-[15px] leading-relaxed">
                  {m.text}
                </motion.p>
              ),
            )
          )}
          <AnimatePresence>
            {thinking && (
              <motion.p {...enter} exit={{ opacity: 0, transition: { duration: 0.1 } }} className="flex gap-1 self-start border-l-2 border-line py-2 pl-3" aria-label="Processing">
                {[0, 0.2, 0.4].map((d) => (
                  <span key={d} className="size-1.5 rounded-full bg-muted animate-blink" style={{ animationDelay: `${d}s` }} />
                ))}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {messages.length > 0 && !listening && (
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="shrink-0 rounded-md border border-line bg-surface px-3 py-2 text-sm transition hover:border-ink/30 active:scale-95">
                {s}
              </button>
            ))}
          </div>
        )}

        {voiceNote && !voiceError && <p className="px-4 pb-2 text-xs text-faint">{voiceNote}</p>}
        <AnimatePresence>
          {voiceError && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2 overflow-hidden px-4 pb-3 text-sm text-hazard"
              role="status"
            >
              <MicOff className="mt-0.5 size-4 shrink-0" />
              {voiceError}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="border-t border-line px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <AnimatePresence mode="wait" initial={false}>
            {listening ? (
              <motion.div key="listening" {...enter} exit={{ opacity: 0 }} className="flex min-h-12 items-center gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-accent-soft">
                  <Waveform className="bg-accent" />
                </span>
                <p dir="auto" className={`min-w-0 flex-1 truncate text-[15px] ${transcript ? "text-ink" : "text-muted"}`} aria-live="polite">
                  {transcript ? `“${transcript}”` : "Listening… speak now"}
                </p>
                <button onClick={() => speechInput.stop()} aria-label="Stop listening" className="grid size-12 shrink-0 place-items-center rounded-lg border border-line transition active:scale-90">
                  <Square className="size-4 fill-current" />
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="compose"
                {...enter}
                exit={{ opacity: 0 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={listen}
                  aria-label="Ask by voice"
                  className={`grid size-12 shrink-0 place-items-center rounded-lg border border-line bg-surface transition hover:border-ink/30 active:scale-90 ${speechInput.isSupported() ? "" : "text-faint"}`}
                >
                  <Mic className="size-5" />
                </button>
                <input
                  dir="auto"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question…"
                  className="min-h-12 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3.5 text-base transition-colors duration-150 outline-none focus:border-ink"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  aria-label="Send"
                  className="grid size-12 shrink-0 place-items-center rounded-lg bg-accent text-white transition hover:bg-accent-strong active:scale-90 disabled:opacity-35"
                >
                  <ArrowUp className="size-5" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
