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
  const [shared, setShared] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [album, setAlbum] = useState("");
  const skipTypewriterRef = useRef(false);

  useEffect(() => {
    setSuggestions(pickRandom(ALL_QUESTIONS, 5));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("wwpwd-history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!answer) {
      setDisplayedAnswer("");
      return;
    }
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

  const saveToHistory = useCallback(
    (q: string, a: string) => {
      const newItem: HistoryItem = {
        question: q,
        answer: a,
        timestamp: Date.now(),
      };
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
      setAvatarState("answered");
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

  const handleShare = () => {
    const snippet = answer.length > 160 ? answer.slice(0, 160) + "…" : answer;
    const text = `I asked The Modfather:\n"${question}"\n\nHe said:\n"${snippet}"\n\nAsk yours → askthemodfather.up.railway.app`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
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
    setAvatarState("idle");
    setAlbum("");
  };

  const isTyping = displayedAnswer.length < answer.length;

  return (
    <main className="min-h-screen flex flex-col items-center px-5 py-16 sm:py-24">
      <div className="w-full max-w-[620px] enter-stagger">

        {/* ── Header ── */}
        <header className="text-center mb-14 sm:mb-20">

          {/* Avatar */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6">
            <div
              className={[
                "w-full h-full rounded-full overflow-hidden border transition-all duration-500",
                avatarState === "idle" ? "border-rule" : "",
                avatarState === "thinking" ? "border-rule animate-thinking" : "",
                avatarState === "answered"
                  ? "border-burgundy/40 shadow-[0_0_0_4px_rgba(110,44,44,0.10)]"
                  : "",
              ].join(" ")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/paul-weller.jpg"
                alt="Stylistic portrait"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Sunglasses — drop in when answered */}
            {avatarState === "answered" && (
              <span
                className="absolute left-1/2 text-xl sm:text-2xl animate-glasses-drop pointer-events-none select-none"
                style={{ top: "36%", transform: "translateX(-50%)" }}
              >
                🕶️
              </span>
            )}

            {/* Thinking dots */}
            {avatarState === "thinking" && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-burgundy animate-dot1" />
                <span className="w-1.5 h-1.5 rounded-full bg-burgundy animate-dot2" />
                <span className="w-1.5 h-1.5 rounded-full bg-burgundy animate-dot3" />
              </div>
            )}
          </div>

          <h1 className="font-serif text-[28px] sm:text-[42px] text-navy tracking-[-0.02em] leading-[1.15]">
            What Would Paul Weller Do?
          </h1>

          <div className="mt-5 w-10 h-px bg-burgundy mx-auto" />

          <p className="mt-5 text-muted text-[13px] sm:text-[14px] leading-relaxed tracking-wide max-w-md mx-auto">
            The Modfather always knows. Well, almost always.
            <br />
            He got lost once — but only because the sat nav
            wasn&apos;t wearing the right shoes.
          </p>
        </header>

        {/* ── Divider ── */}
        <div className="h-px bg-rule mb-10 animate-draw" />

        {/* ── Input ── */}
        <section>
          <label
            htmlFor="question"
            className="block text-[10px] uppercase tracking-[0.2em] text-muted mb-4"
          >
            Your question
          </label>

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

          <div className="flex items-center justify-between mt-5">
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !question.trim()}
              className="text-[11px] uppercase tracking-[0.2em] text-charcoal border border-charcoal px-5 py-2 hover:bg-charcoal hover:text-paper transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
            >
              {loading ? "Give it a second…" : "Go on then"}
            </button>

            {question && !loading && (
              <button
                onClick={() => {
                  setQuestion("");
                  setAnswer("");
                  setError("");
                  setAvatarState("idle");
                  setAlbum("");
                }}
                className="text-[10px] uppercase tracking-[0.2em] text-muted hover:text-charcoal transition-colors"
              >
                Start over
              </button>
            )}
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
                    setQuestion(q);
                    handleSubmit(q);
                  }}
                  className="block w-full text-left text-[13px] text-olive hover:text-charcoal py-2 border-b border-rule/40 last:border-0 transition-colors"
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

        {/* ── Response ── */}
        {answer && (
          <section className="mt-12 animate-fade-up">
            <div className="h-px bg-rule mb-8 animate-draw" />

            <p className="text-[10px] uppercase tracking-[0.25em] text-burgundy mb-6">
              WWPWD says
            </p>

            <div className="bg-beige/40 border-l-2 border-burgundy py-8 px-6 sm:px-8">
              <blockquote className="font-serif text-navy text-[17px] sm:text-[19px] leading-[1.7] whitespace-pre-line">
                {displayedAnswer}
                {isTyping && (
                  <span className="animate-blink ml-px text-burgundy">|</span>
                )}
              </blockquote>
            </div>

            {/* Album credit */}
            {album && !isTyping && (
              <p className="mt-3 text-[10px] text-muted/50 tracking-[0.15em] uppercase animate-reveal">
                Wisdom sourced from:{" "}
                <span className="italic normal-case tracking-normal">{album}</span>
              </p>
            )}

            <p className="mt-4 text-[11px] text-muted/50 italic tracking-wide">
              Make of that what you will.
            </p>

            <div className="mt-6 flex items-center gap-6 flex-wrap">
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
          </section>
        )}

        {/* ── Loading ── */}
        {loading && (
          <section className="mt-12">
            <div className="h-px bg-rule mb-8" />
            <p className="text-[13px] text-muted italic">Still thinking.</p>
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
        <p className="text-[10px] text-muted/50 tracking-[0.1em] leading-relaxed">
          Not affiliated. Just having a think.
        </p>
      </footer>
    </main>
  );
}
