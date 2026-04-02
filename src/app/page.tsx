"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const ALL_QUESTIONS = [
  "Should I quit my job and start a band?",
  "Is it worth going back to someone who let you down?",
  "What do you do when the world feels like it has gone mad?",
  "How do you stay sharp when everyone around you is giving up?",
  "Should I care what people think of me?",
  "How do you deal with getting older?",
  "Is it too late to change direction?",
  "Should I buy the expensive jacket?",
  "How do you know when a friendship has run its course?",
  "What do you do when you have lost your confidence?",
  "Is vinyl really better than digital?",
  "How do you stay relevant without selling out?",
  "Should I move to London?",
  "What is the secret to looking sharp on a budget?",
  "How do you get over a creative block?",
  "Is it worth learning an instrument at 30?",
  "Should I tell them how I really feel?",
  "What do you do when no one believes in your idea?",
];

const ALBUMS = [
  "In the City", "This Is the Modern World", "All Mod Cons", "Setting Sons",
  "Sound Affects", "The Gift", "Paul Weller", "Wild Wood", "Stanley Road",
  "Heavy Soul", "Illumination", "As Is Now", "22 Dreams", "Wake Up the Nation",
  "Sonik Kicks", "Saturn's Pattern", "A Kind Revolution", "On Sunset", "Fat Pop",
];

// Idle nudges shown after 30s of inactivity
const IDLE_NUDGES = [
  "Something on your mind?",
  "Go on. He won't bite.",
  "No question too small.",
  "The Modfather's waiting.",
  "Ask him. You know you want to.",
];

function pickRandom(arr: string[], count: number): string[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

interface HistoryItem {
  question: string;
  answer: string;
  timestamp: number;
}

type AvatarState = "idle" | "thinking" | "answered";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [bubbleCopied, setBubbleCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [album, setAlbum] = useState("");
  const [sharpness, setSharpness] = useState(0);
  const [idleNudge, setIdleNudge] = useState("");
  const [showHint, setShowHint] = useState(false);
  const skipTypewriterRef = useRef(false);
  const answerRef = useRef<HTMLElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const questionCountRef = useRef(0);

  useEffect(() => {
    setSuggestions(pickRandom(ALL_QUESTIONS, 5));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("wwpwd-history");
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch { /* ignore */ }
    }
    // Load question count
    const count = parseInt(localStorage.getItem("wwpwd-count") || "0", 10);
    questionCountRef.current = count;
  }, []);

  // Idle nudge — appears after 30s of inactivity on idle state
  useEffect(() => {
    if (answer || loading) { setIdleNudge(""); return; }
    const reset = () => {
      setIdleNudge("");
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (!answer && !loading) {
          setIdleNudge(IDLE_NUDGES[Math.floor(Math.random() * IDLE_NUDGES.length)]);
        }
      }, 30000);
    };
    reset();
    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    return () => {
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [answer, loading]);

  // Typewriter effect
  useEffect(() => {
    if (!answer) { setDisplayedAnswer(""); return; }
    if (skipTypewriterRef.current) {
      skipTypewriterRef.current = false;
      setDisplayedAnswer(answer);
      return;
    }
    setDisplayedAnswer("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedAnswer(answer.slice(0, i));
      if (i >= answer.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [answer]);

  // Scroll to answer when it arrives
  useEffect(() => {
    if (answer && answerRef.current) {
      setTimeout(() => {
        answerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [answer]);

  // Keyboard hint — show after typing starts
  useEffect(() => {
    if (question.length > 0) {
      setShowHint(true);
    } else {
      setShowHint(false);
    }
  }, [question]);

  const saveToHistory = useCallback(
    (q: string, a: string) => {
      const newItem: HistoryItem = { question: q, answer: a, timestamp: Date.now() };
      const updated = [newItem, ...history].slice(0, 5);
      setHistory(updated);
      localStorage.setItem("wwpwd-history", JSON.stringify(updated));
    },
    [history]
  );

  const handleSubmit = async (q?: string) => {
    const text = (q || question).trim();
    if (!text || loading) return;
    setLoading(true);
    setError("");
    setAnswer("");
    setAlbum("");
    setSharpness(0);
    setIdleNudge("");
    setAvatarState("thinking");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setAvatarState("idle");
        return;
      }
      setAnswer(data.answer);
      setAlbum(ALBUMS[Math.floor(Math.random() * ALBUMS.length)]);
      setSharpness(Math.floor(Math.random() * 2) + 4); // 4 or 5 — he's always sharp
      setAvatarState("answered");
      // Increment question count
      questionCountRef.current += 1;
      localStorage.setItem("wwpwd-count", String(questionCountRef.current));
      saveToHistory(text, data.answer);
    } catch {
      setError("Could not reach the server. Try again.");
      setAvatarState("idle");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBubbleCopy = async () => {
    if (!answer) return;
    await navigator.clipboard.writeText(answer);
    setBubbleCopied(true);
    setTimeout(() => setBubbleCopied(false), 1500);
  };

  const handleShare = () => {
    const snippet = answer.length > 160 ? answer.slice(0, 160) + "…" : answer;
    const text = `I asked The Modfather:\n"${question}"\n\nHe said:\n"${snippet}"\n\nAsk yours → askthemodfather.up.railway.app`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleReset = () => {
    setAnswer("");
    setQuestion("");
    setSuggestions(pickRandom(ALL_QUESTIONS, 5));
    setActiveSuggestion(null);
    setAvatarState("idle");
    setAlbum("");
    setSharpness(0);
  };

  const isTyping = displayedAnswer.length < answer.length;
  const charCount = question.length;
  const nearLimit = charCount > 400;

  return (
    <main className="min-h-screen flex flex-col items-center px-5 py-16 sm:py-24">
      <div className="w-full max-w-[620px] enter-stagger">

        {/* ── Header — purely typographic ── */}
        <header className="text-center mb-14 sm:mb-20">
          <h1 className="font-serif text-[30px] sm:text-[46px] text-navy tracking-[-0.02em] leading-[1.15]">
            What Would Paul Weller Do?
          </h1>
          <div className="mt-5 w-10 h-px bg-burgundy mx-auto" />
          <p className="mt-5 text-muted text-[13px] sm:text-[14px] leading-relaxed tracking-wide max-w-sm mx-auto">
            The Modfather always knows. Well, almost always.
          </p>
        </header>

        {/* ── Divider ── */}
        <div className="h-px bg-rule mb-10 animate-draw" />

        {/* ── Input ── */}
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <label
              htmlFor="question"
              className="text-[10px] uppercase tracking-[0.2em] text-muted"
            >
              Your question
            </label>
            {/* Character counter — fades in near limit */}
            <span
              className={`text-[10px] tabular-nums transition-all duration-300 ${
                nearLimit
                  ? charCount > 470
                    ? "text-burgundy opacity-100"
                    : "text-muted opacity-70"
                  : "opacity-0"
              }`}
            >
              {500 - charCount}
            </span>
          </div>

          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Go on then… what's the situation?"
            rows={3}
            maxLength={500}
            disabled={loading}
            className="w-full bg-white/60 border border-rule rounded px-4 py-4 text-charcoal text-[15px] sm:text-base leading-relaxed placeholder:text-muted/50 focus:outline-none focus:border-burgundy/40 focus:ring-1 focus:ring-burgundy/10 transition-all disabled:opacity-40"
          />

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !question.trim()}
              className="text-[11px] uppercase tracking-[0.2em] text-charcoal border border-charcoal px-5 py-2 hover:bg-charcoal hover:text-paper transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
            >
              {loading ? "Give it a second…" : "Go on then"}
            </button>

            <div className="flex items-center gap-4">
              {/* Keyboard hint */}
              {showHint && !loading && (
                <span className="text-[10px] text-muted/40 tracking-wide animate-reveal">
                  ↵ to submit
                </span>
              )}
              {question && !loading && (
                <button
                  onClick={() => {
                    setQuestion("");
                    setAnswer("");
                    setError("");
                    setAvatarState("idle");
                    setAlbum("");
                    setShowHint(false);
                  }}
                  className="text-[10px] uppercase tracking-[0.2em] text-muted hover:text-charcoal transition-colors"
                >
                  Start over
                </button>
              )}
            </div>
          </div>

          {!question && !answer && !loading && (
            <p className="mt-3 text-[11px] text-muted/60 tracking-wide">
              No pressure.
            </p>
          )}
        </section>

        {/* ── Suggested Questions ── */}
        {!answer && !loading && (
          <section className="mt-12 animate-reveal">
            <div className="h-px bg-rule mb-6" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
              Or if you&apos;re stuck
            </p>
            <div className="space-y-1.5">
              {suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setActiveSuggestion(q);
                    setQuestion(q);
                    handleSubmit(q);
                  }}
                  className={`block w-full text-left text-[13px] py-2 border-b border-rule/40 last:border-0 transition-all duration-300 ${
                    activeSuggestion === null
                      ? "text-olive hover:text-charcoal opacity-100"
                      : activeSuggestion === q
                      ? "text-charcoal opacity-100"
                      : "text-muted/30 opacity-30 pointer-events-none"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="mt-8 py-4 border-t border-b border-burgundy/20">
            <p className="text-[13px] text-burgundy">{error}</p>
          </div>
        )}

        {/* ── Loading — face thinks ── */}
        {loading && (
          <section className="mt-12 animate-reveal">
            <div className="h-px bg-rule mb-10" />
            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-rule animate-thinking">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/paul-weller.jpg"
                    alt=""
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy/60 animate-dot1" />
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy/60 animate-dot2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy/60 animate-dot3" />
                </div>
              </div>
              <p className="text-[12px] text-muted italic mt-1">Still thinking.</p>
            </div>
          </section>
        )}

        {/* ── Response — face + speech bubble ── */}
        {answer && (
          <section ref={answerRef} className="mt-12 animate-fade-up scroll-mt-8">
            <div className="h-px bg-rule mb-8 animate-draw" />

            {/* Sharpness rating */}
            {sharpness > 0 && !isTyping && (
              <div className="flex items-center gap-2 mb-5 animate-reveal">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                  Sharpness
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`inline-block w-2 h-2 rounded-full transition-colors ${
                        i < sharpness ? "bg-burgundy" : "bg-rule"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Face + bubble */}
            <div className="flex items-start gap-4 sm:gap-5">
              {/* Portrait */}
              <div className="relative flex-shrink-0 mt-1">
                <div className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden border border-burgundy/30 shadow-[0_0_0_4px_rgba(110,44,44,0.08)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/paul-weller.jpg"
                    alt="The Modfather"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <span
                  className="absolute left-1/2 text-base sm:text-xl animate-glasses-drop pointer-events-none select-none"
                  style={{ top: "34%", transform: "translateX(-50%)" }}
                >
                  🕶️
                </span>
              </div>

              {/* Speech bubble — double-click to copy */}
              <div
                className={`speech-bubble flex-1 min-w-0 cursor-default select-none transition-all duration-200 ${bubbleCopied ? "opacity-60" : ""}`}
                onDoubleClick={handleBubbleCopy}
                title="Double-click to copy"
              >
                {bubbleCopied && (
                  <p className="text-[10px] uppercase tracking-[0.15em] text-burgundy mb-2 animate-reveal">
                    Copied
                  </p>
                )}
                <blockquote className="font-serif text-navy text-[16px] sm:text-[18px] leading-[1.75] whitespace-pre-line select-text">
                  {displayedAnswer}
                  {isTyping && (
                    <span className="animate-blink ml-px text-burgundy/60">|</span>
                  )}
                </blockquote>
              </div>
            </div>

            {/* Below bubble — indented to align with bubble */}
            {!isTyping && (
              <div className="mt-5 pl-[calc(3.5rem+1rem)] sm:pl-[calc(4.5rem+1.25rem)] animate-reveal">
                {album && (
                  <p className="text-[10px] text-muted/50 tracking-[0.12em] uppercase mb-3">
                    Wisdom from:{" "}
                    <span className="italic normal-case tracking-normal">{album}</span>
                  </p>
                )}
                <p className="text-[11px] text-muted/40 italic tracking-wide mb-5">
                  Make of that what you will.
                </p>
                <div className="flex items-center gap-5 flex-wrap">
                  <button
                    onClick={handleCopy}
                    className="text-[10px] uppercase tracking-[0.2em] text-muted hover:text-charcoal transition-colors"
                  >
                    {copied ? "Done" : "Copy"}
                  </button>
                  <span className="text-rule">·</span>
                  <button
                    onClick={handleShare}
                    className="text-[10px] uppercase tracking-[0.2em] text-muted hover:text-charcoal transition-colors"
                  >
                    {shared ? "Shared" : "Share on X"}
                  </button>
                  <span className="text-rule">·</span>
                  <button
                    onClick={handleReset}
                    className="text-[10px] uppercase tracking-[0.2em] text-muted hover:text-charcoal transition-colors"
                  >
                    Ask another
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── History ── */}
        {history.length > 0 && !loading && !answer && (
          <section className="mt-16 animate-reveal">
            <div className="h-px bg-rule mb-6" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
              Previously
            </p>
            <div className="space-y-1">
              {history.map((item) => (
                <button
                  key={item.timestamp}
                  onClick={() => {
                    skipTypewriterRef.current = true;
                    setQuestion(item.question);
                    setAnswer(item.answer);
                    setAvatarState("answered");
                  }}
                  className="block w-full text-left text-[12px] text-muted hover:text-charcoal py-2 border-b border-rule/30 last:border-0 transition-colors truncate"
                >
                  {item.question}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="mt-auto pt-20 pb-8 text-center">
        <div className="w-6 h-px bg-rule mx-auto mb-5" />
        {/* Idle nudge */}
        {idleNudge && (
          <p className="text-[11px] text-burgundy/50 italic mb-3 animate-reveal">
            {idleNudge}
          </p>
        )}
        <p className="text-[10px] text-muted/50 tracking-[0.1em] leading-relaxed">
          Not affiliated. Just having a think.
        </p>
      </footer>
    </main>
  );
}
