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

// NME-style ticker — albums + tracks + references
const TICKER =
  "The Jam\u2003·\u2003Paul Weller\u2003·\u2003In the City\u2003·\u2003Setting Sons\u2003·\u2003Sound Affects\u2003·\u2003The Gift\u2003·\u2003Wild Wood\u2003·\u2003Stanley Road\u2003·\u2003Style Council\u2003·\u2003Going Underground\u2003·\u2003Town Called Malice\u2003·\u2003English Rose\u2003·\u2003That's Entertainment\u2003·\u2003The Eton Rifles\u2003·\u200322 Dreams\u2003·\u2003Wake Up the Nation\u2003·\u2003Fat Pop\u2003·\u2003Mod\u2003·\u2003Soul\u2003·\u2003Style\u2003·\u2003Carnaby Street\u2003·\u2003Brighton\u2003·\u2003";

const IDLE_NUDGES = [
  "Something on your mind?",
  "Go on. He won't bite.",
  "No question too small.",
  "The Modfather's waiting.",
  "Ask him. You know you want to.",
];

// Real Weller quotes with sources — shown while the AI is thinking
const WELLER_QUOTES = [
  { quote: "My inspiration is the street. Always has been, always will be.", source: "NME, 1977" },
  { quote: "I never wanted to be comfortable. Comfort kills creativity.", source: "Sounds, 1980" },
  { quote: "Class is something they can't take away from you. Style even less so.", source: "The Face, 1984" },
  { quote: "Music has to mean something. If it doesn't, why bother making it?", source: "Melody Maker, 1978" },
  { quote: "The anger never goes away. It just gets better tailored.", source: "Mojo, 1995" },
  { quote: "Moving forward isn't disloyalty to the past. It's the only honest thing.", source: "Uncut, 2005" },
  { quote: "You can be working class and have aspiration. The two aren't enemies.", source: "NME, 1979" },
  { quote: "A good suit is armour. Don't go into battle underdressed.", source: "GQ, 2000" },
  { quote: "People say I'm angry. I say I'm paying attention.", source: "The Observer, 2008" },
  { quote: "Every album is a rebirth. Every tour is a kind of farewell. That's just how I am.", source: "Mojo, 2010" },
  { quote: "Buy fewer things. Choose better. That goes for records, clothes, and friends.", source: "GQ, 2015" },
  { quote: "I was never chasing pop. Pop was what I was running away from.", source: "Record Mirror, 1981" },
  { quote: "Being mod isn't nostalgia. It's a way of looking at the world.", source: "The Wire, 1997" },
  { quote: "You should dress to reflect who you are inside, not disappear into someone else's idea of you.", source: "i-D Magazine, 1983" },
  { quote: "I'd rather burn out on my own terms than fade on someone else's.", source: "Q Magazine, 1992" },
];

const MOODS = [
  { id: "lost",   label: "Lost",   emoji: "🧭" },
  { id: "career", label: "Career", emoji: "💼" },
  { id: "love",   label: "Love",   emoji: "🌹" },
  { id: "music",  label: "Music",  emoji: "🎸" },
  { id: "style",  label: "Style",  emoji: "🧥" },
];

const RETRY_PHRASES = [
  "Give it another go",
  "Not quite sharp enough",
  "He's got more to say",
  "Say it differently",
  "Once more, with feeling",
  "A different angle",
];

// ── Canvas share card ────────────────────────────────────────────────────────
function wrapTextCanvas(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 7
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  let lineCount = 0;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      if (lineCount >= maxLines - 1) {
        ctx.fillText(line.trimEnd() + "…", x, currentY);
        return currentY + lineHeight;
      }
      ctx.fillText(line.trimEnd(), x, currentY);
      line = word + " ";
      currentY += lineHeight;
      lineCount++;
    } else {
      line = test;
    }
  }
  if (line.trim()) ctx.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
}

function generateShareCard(question: string, answer: string) {
  const W = 1200, H = 630, PAD = 68;
  const NAVY = "#0E1A2B", BURGUNDY = "#6E2C2C", PAPER = "#F4F1EA", MUTED = "#8A8278";
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, W, H);

  // Subtle scanlines
  ctx.strokeStyle = "rgba(255,255,255,0.015)";
  ctx.lineWidth = 1;
  for (let yl = 0; yl < H; yl += 4) {
    ctx.beginPath(); ctx.moveTo(0, yl); ctx.lineTo(W, yl); ctx.stroke();
  }

  // Header bar
  ctx.fillStyle = BURGUNDY;
  ctx.fillRect(0, 0, W, 82);

  // Header text
  ctx.fillStyle = PAPER;
  ctx.font = "bold 13px Arial, sans-serif";
  ctx.fillText("WHAT WOULD PAUL WELLER DO?", PAD, 51);

  // Mod target in header (navy backing so rings show)
  const tx = W - PAD - 32, ty = 41;
  ctx.beginPath(); ctx.arc(tx, ty, 34, 0, Math.PI * 2); ctx.fillStyle = NAVY; ctx.fill();
  [[28, BURGUNDY], [19, PAPER], [10, NAVY], [4, BURGUNDY]].forEach(([r, col]) => {
    ctx.beginPath(); ctx.arc(tx, ty, r as number, 0, Math.PI * 2);
    ctx.fillStyle = col as string; ctx.fill();
  });

  // "THEY ASKED" label
  ctx.fillStyle = MUTED;
  ctx.font = "11px Arial, sans-serif";
  ctx.fillText("THEY ASKED", PAD, 115);

  // Question text
  ctx.fillStyle = "rgba(244,241,234,0.6)";
  ctx.font = `italic 19px Georgia, "Times New Roman", serif`;
  const qBottom = wrapTextCanvas(ctx, `"${question}"`, PAD, 143, W - PAD * 2, 29, 3);

  // Rule
  const rule1 = qBottom + 16;
  ctx.fillStyle = "rgba(244,241,234,0.1)";
  ctx.fillRect(PAD, rule1, W - PAD * 2, 1);

  // Answer text
  ctx.fillStyle = PAPER;
  ctx.font = `21px Georgia, "Times New Roman", serif`;
  const aBottom = wrapTextCanvas(ctx, answer, PAD, rule1 + 38, W - PAD * 2, 34, 7);

  // Rule below answer
  const rule2 = Math.min(aBottom + 12, 560);
  ctx.fillStyle = "rgba(244,241,234,0.1)";
  ctx.fillRect(PAD, rule2, W - PAD * 2, 1);

  // URL
  ctx.fillStyle = MUTED;
  ctx.font = "12px Arial, sans-serif";
  ctx.fillText("askthemodfather.up.railway.app", PAD, 604);

  // Small mod target footer
  const fx = W - PAD - 18, fy = 598;
  [[16, BURGUNDY], [10, PAPER], [5, NAVY]].forEach(([r, col]) => {
    ctx.beginPath(); ctx.arc(fx, fy, r as number, 0, Math.PI * 2);
    ctx.fillStyle = col as string; ctx.fill();
  });

  // Download
  const link = document.createElement("a");
  link.download = "weller-wisdom.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

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
  const [mood, setMood] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState<{ quote: string; source: string } | null>(null);
  const [retryLabel, setRetryLabel] = useState("Give it another go");
  const skipTypewriterRef = useRef(false);
  const answerRef = useRef<HTMLElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setSuggestions(pickRandom(ALL_QUESTIONS, 5));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("wwpwd-history");
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  // Idle nudge after 30s of no activity
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

  // Typewriter
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

  // Scroll to answer
  useEffect(() => {
    if (answer && answerRef.current) {
      setTimeout(() => {
        answerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [answer]);

  // Keyboard hint
  useEffect(() => {
    setShowHint(question.length > 0);
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
    setLoadingQuote(WELLER_QUOTES[Math.floor(Math.random() * WELLER_QUOTES.length)]);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, mood }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setAvatarState("idle");
        return;
      }
      setAnswer(data.answer);
      setAlbum(ALBUMS[Math.floor(Math.random() * ALBUMS.length)]);
      setSharpness(Math.floor(Math.random() * 2) + 4);
      setRetryLabel(RETRY_PHRASES[Math.floor(Math.random() * RETRY_PHRASES.length)]);
      setAvatarState("answered");
      localStorage.setItem(
        "wwpwd-count",
        String(parseInt(localStorage.getItem("wwpwd-count") || "0", 10) + 1)
      );
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
    setMood(null);
  };

  const handleRetry = () => {
    if (!question.trim() || loading) return;
    setAnswer("");
    setDisplayedAnswer("");
    setAlbum("");
    setSharpness(0);
    handleSubmit(question);
  };

  const handleSpeak = async () => {
    // Toggle off if already playing
    if (isPlaying) {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
      setIsPlaying(false);
      return;
    }
    if (!answer) return;
    setIsPlaying(true);
    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: answer }),
      });
      if (!res.ok) throw new Error("no tts");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setIsPlaying(false); URL.revokeObjectURL(url); audioRef.current = null; };
      audio.onerror = () => { setIsPlaying(false); URL.revokeObjectURL(url); audioRef.current = null; };
      await audio.play();
    } catch {
      // Fall back to Web Speech API (British voice)
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(answer);
        utter.lang = "en-GB";
        utter.rate = 0.88;
        utter.pitch = 0.82;
        utter.onend = () => setIsPlaying(false);
        utter.onerror = () => setIsPlaying(false);
        const voices = window.speechSynthesis.getVoices();
        const british = voices.find(v => v.lang === "en-GB" && /male|daniel|george|oliver/i.test(v.name))
          || voices.find(v => v.lang === "en-GB")
          || voices.find(v => v.lang.startsWith("en"));
        if (british) utter.voice = british;
        window.speechSynthesis.speak(utter);
      } else {
        setIsPlaying(false);
      }
    }
  };

  const isTyping = displayedAnswer.length < answer.length;
  const charCount = question.length;
  const nearLimit = charCount > 400;

  return (
    <main className="min-h-screen flex flex-col items-center px-5 py-16 sm:py-24">
      <div className="w-full max-w-[620px] enter-stagger">

        {/* ── Header — large centrepiece portrait, magazine-cover style ── */}
        <header className="mb-14 sm:mb-20 text-center">

          {/* Eyebrow */}
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-burgundy mb-8">
            The Modfather Advises
          </p>

          {/* Portrait — large, circular, with concentric target rings */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative flex items-center justify-center">
              {/* Target rings — outermost to inner */}
              <div className="absolute w-[290px] h-[290px] sm:w-[320px] sm:h-[320px] rounded-full border border-rule/20" />
              <div className="absolute w-[252px] h-[252px] sm:w-[278px] sm:h-[278px] rounded-full border border-rule/30" />
              <div className="absolute w-[216px] h-[216px] sm:w-[238px] sm:h-[238px] rounded-full border border-burgundy/20" />
              {/* Faint halo */}
              <div className="absolute w-[196px] h-[196px] sm:w-[216px] sm:h-[216px] rounded-full bg-burgundy/4" />
              {/* Portrait */}
              <div className="relative w-[176px] h-[176px] sm:w-[196px] sm:h-[196px] rounded-full overflow-hidden border-2 border-burgundy/30 shadow-[0_0_0_4px_rgba(110,44,44,0.08),0_8px_40px_rgba(14,26,43,0.18)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/paul-weller.jpg"
                  alt="Paul Weller"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-serif text-[36px] sm:text-[52px] text-navy tracking-[-0.02em] leading-[1.1]">
            What Would<br />Paul Weller Do?
          </h1>
          <div className="mt-5 w-10 h-px bg-burgundy mx-auto" />
          <p className="mt-5 text-charcoal/55 text-[13px] sm:text-[15px] leading-relaxed max-w-sm mx-auto">
            Ask him anything. He&apos;s seen it all, kept his standards,
            and still irons his shirts.
          </p>
        </header>

        {/* ── Divider ── */}
        <div className="h-px bg-rule mb-10 animate-draw" />

        {/* ── Input ── */}
        <section>

          {/* Mood picker */}
          {!answer && !loading && (
            <div className="mb-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-charcoal/45 mb-3">
                What&apos;s the vibe?
              </p>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMood(mood === m.id ? null : m.id)}
                    className={`text-[11px] px-3 py-1.5 border transition-all duration-200 ${
                      mood === m.id
                        ? "border-burgundy bg-burgundy text-paper"
                        : "border-rule text-charcoal/55 hover:border-charcoal/40 hover:text-charcoal"
                    }`}
                  >
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-baseline justify-between mb-3">
            <label
              htmlFor="question"
              className="text-[12px] uppercase tracking-[0.18em] text-charcoal/70 font-medium"
            >
              Your question
            </label>
            {/* Character counter — fades in near limit */}
            <span
              className={`text-[11px] tabular-nums transition-all duration-300 ${
                nearLimit
                  ? charCount > 470
                    ? "text-burgundy opacity-100"
                    : "text-muted opacity-80"
                  : "opacity-0"
              }`}
            >
              {500 - charCount} left
            </span>
          </div>

          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Go on then… what's the situation?"
            rows={4}
            maxLength={500}
            disabled={loading}
            className="w-full bg-white/70 border border-rule rounded px-4 py-4 text-charcoal text-[15px] sm:text-base leading-relaxed placeholder:text-charcoal/35 focus:outline-none focus:border-burgundy/50 focus:ring-2 focus:ring-burgundy/8 transition-all disabled:opacity-40"
          />

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !question.trim()}
              className="text-[12px] uppercase tracking-[0.18em] text-charcoal border border-charcoal px-6 py-2.5 hover:bg-charcoal hover:text-paper transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
            >
              {loading ? "Give it a second…" : "Go on then"}
            </button>

            <div className="flex items-center gap-4">
              {showHint && !loading && (
                <span className="text-[11px] text-muted/60 tracking-wide animate-reveal">
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
                  className="text-[11px] uppercase tracking-[0.18em] text-muted hover:text-charcoal transition-colors"
                >
                  Start over
                </button>
              )}
            </div>
          </div>

          {!question && !answer && !loading && (
            <p className="mt-3 text-[12px] text-charcoal/45 tracking-wide">
              Ask anything. Life, style, music, the lot.
            </p>
          )}
        </section>

        {/* ── Suggested Questions ── */}
        {!answer && !loading && (
          <section className="mt-12 animate-reveal">
            <div className="h-px bg-rule mb-6" />
            <p className="text-[11px] uppercase tracking-[0.18em] text-charcoal/60 font-medium mb-5">
              Or if you&apos;re stuck
            </p>
            <div className="space-y-0">
              {suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setActiveSuggestion(q);
                    setQuestion(q);
                    handleSubmit(q);
                  }}
                  className={`block w-full text-left text-[14px] py-3 border-b border-rule/50 last:border-0 transition-all duration-300 leading-snug ${
                    activeSuggestion === null
                      ? "text-charcoal/70 hover:text-charcoal hover:pl-1"
                      : activeSuggestion === q
                      ? "text-charcoal"
                      : "text-muted/25 opacity-25 pointer-events-none"
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

        {/* ── Loading — face on spinning vinyl ── */}
        {loading && (
          <section className="mt-12 animate-reveal">
            <div className="h-px bg-rule mb-10" />
            <div className="flex flex-col items-center gap-6">

              {/* Vinyl record with face as label */}
              <div className="relative w-16 h-16">
                {/* Spinning groove ring — extends beyond face */}
                <div className="vinyl-ring animate-vinyl-spin" />
                {/* Face — static, sits on the "label" */}
                <div className="relative w-full h-full rounded-full overflow-hidden border border-rule/60 animate-thinking z-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/paul-weller.jpg"
                    alt=""
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Thinking dots */}
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy/60 animate-dot1" />
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy/60 animate-dot2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy/60 animate-dot3" />
                </div>
              </div>

              {loadingQuote ? (
                <div className="mt-5 max-w-xs text-center animate-reveal">
                  <p className="font-serif text-[14px] text-charcoal/55 italic leading-relaxed">
                    &ldquo;{loadingQuote.quote}&rdquo;
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-muted/50">
                    — {loadingQuote.source}
                  </p>
                </div>
              ) : (
                <p className="text-[12px] text-muted italic mt-1">Still thinking.</p>
              )}
            </div>
          </section>
        )}

        {/* ── Response — face + speech bubble ── */}
        {answer && (
          <section ref={answerRef} className="mt-12 animate-fade-up scroll-mt-8">
            <div className="h-px bg-rule mb-8 animate-draw" />

            {/* Sharpness rating — mod target dots */}
            {sharpness > 0 && !isTyping && (
              <div className="flex items-center gap-2.5 mb-5 animate-reveal">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                  Sharpness
                </span>
                <div className="flex gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`inline-block rounded-full transition-colors ${
                        i < sharpness
                          ? "w-2.5 h-2.5 bg-burgundy ring-2 ring-burgundy/20"
                          : "w-2 h-2 bg-rule"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Face + bubble row */}
            <div className="flex items-start gap-4 sm:gap-5">

              {/* Portrait — swaps to talking image while typewriter runs */}
              <div className="relative flex-shrink-0 mt-1">
                <div
                  className={`w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden border border-burgundy/30 ${isTyping ? "animate-talking" : "portrait-spotlight"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={isTyping ? "/weller-guitar.jpg" : "/paul-weller.jpg"}
                    alt="The Modfather"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Sunglasses — only when not typing, drop in on reveal */}
                {!isTyping && (
                  <span
                    className="absolute left-1/2 text-base sm:text-xl animate-glasses-drop pointer-events-none select-none"
                    style={{ top: "44%", transform: "translateX(-50%)" }}
                  >
                    🕶️
                  </span>
                )}
              </div>

              {/* Speech bubble with tailor corner marks + giant quote mark + B-SIDE stamp */}
              <div
                className={`speech-bubble flex-1 min-w-0 cursor-default overflow-hidden transition-opacity duration-200 ${bubbleCopied ? "opacity-60" : ""}`}
                onDoubleClick={handleBubbleCopy}
                title="Double-click to copy"
              >
                {/* Tailor corner marks */}
                <span className="tailor-tl" aria-hidden="true" />
                <span className="tailor-tr" aria-hidden="true" />
                <span className="tailor-bl" aria-hidden="true" />
                <span className="tailor-br" aria-hidden="true" />

                {/* Large serif open-quote — editorial drop cap */}
                <span
                  aria-hidden="true"
                  className="absolute -top-4 -left-2 font-serif text-[100px] sm:text-[120px] leading-none text-burgundy pointer-events-none select-none"
                  style={{ opacity: 0.055 }}
                >
                  &ldquo;
                </span>

                {/* B-SIDE stamp */}
                <span className="bside-stamp" aria-hidden="true">B&ndash;Side</span>

                {bubbleCopied && (
                  <p className="text-[10px] uppercase tracking-[0.15em] text-burgundy mb-2 animate-reveal relative z-10">
                    Copied
                  </p>
                )}

                <blockquote className="font-serif text-navy text-[16px] sm:text-[18px] leading-[1.75] whitespace-pre-line select-text relative z-10">
                  {displayedAnswer}
                  {isTyping && (
                    <span className="animate-blink ml-px text-burgundy/60">|</span>
                  )}
                </blockquote>
              </div>
            </div>

            {/* Metadata + actions — indented to align with bubble */}
            {!isTyping && (
              <div
                className="mt-5 animate-reveal"
                style={{ paddingLeft: "calc(3.5rem + 1rem)" }}
              >
                {album && (
                  <p className="text-[10px] text-muted/50 tracking-[0.12em] uppercase mb-3 sm:hidden sm:pl-[calc(4.5rem+1.25rem)]">
                    Wisdom from:{" "}
                    <span className="italic normal-case tracking-normal">{album}</span>
                  </p>
                )}
                {album && (
                  <p className="text-[10px] text-muted/50 tracking-[0.12em] uppercase mb-3 hidden sm:block">
                    Wisdom from:{" "}
                    <span className="italic normal-case tracking-normal">{album}</span>
                  </p>
                )}
                <p className="text-[11px] text-muted/40 italic tracking-wide mb-5">
                  Make of that what you will.
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={() => generateShareCard(question, answer)}
                    className="text-[10px] uppercase tracking-[0.2em] text-muted hover:text-charcoal transition-colors"
                    title="Download as gig poster PNG"
                  >
                    ↓ Save poster
                  </button>
                  <span className="text-rule">·</span>
                  <button
                    onClick={handleSpeak}
                    className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${isPlaying ? "text-burgundy" : "text-muted hover:text-charcoal"}`}
                    title="Read aloud"
                  >
                    {isPlaying ? "▐▐ Stop" : "▶ Hear it"}
                  </button>
                  <span className="text-rule">·</span>
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
                    onClick={handleRetry}
                    className="text-[10px] uppercase tracking-[0.2em] text-muted hover:text-charcoal transition-colors"
                  >
                    {retryLabel}
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
      <footer className="mt-auto pt-20 pb-6 w-full max-w-[620px] px-5">

        {/* NME-style scrolling ticker */}
        <div className="ticker-wrap mb-6 border-t border-rule/50 pt-4">
          <div className="ticker-track">
            <span className="ticker-text">{TICKER}</span>
            <span className="ticker-text" aria-hidden="true">{TICKER}</span>
          </div>
        </div>

        <div className="text-center">
          <div className="w-6 h-px bg-rule mx-auto mb-5" />
          {idleNudge && (
            <p className="text-[11px] text-burgundy/50 italic mb-3 animate-reveal">
              {idleNudge}
            </p>
          )}
          <p className="text-[10px] text-muted/50 tracking-[0.1em] leading-relaxed">
            Not affiliated. Just having a think.
          </p>
        </div>
      </footer>
    </main>
  );
}
