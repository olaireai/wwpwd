"use client";

import { useState, useEffect, useCallback } from "react";

const SUGGESTED_QUESTIONS = [
  "Should I quit my job and start a band?",
  "Is it worth going back to someone who let you down?",
  "What do you do when the world feels like it has gone mad?",
  "How do you stay sharp when everyone around you is giving up?",
  "Should I care what people think of me?",
];

interface HistoryItem {
  question: string;
  answer: string;
  timestamp: number;
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("wwpwd-history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        // Ignore corrupt data
      }
    }
  }, []);

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

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setAnswer(data.answer);
      saveToHistory(text, data.answer);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setQuestion("");
    setAnswer("");
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-start px-4 py-12 sm:py-20">
      {/* Header */}
      <header className="text-center mb-10 sm:mb-14 max-w-2xl">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal tracking-tight leading-tight">
          What Would
          <br />
          <span className="text-navy">Paul Weller</span> Do?
        </h1>
        <div className="mt-4 w-12 h-px bg-burgundy mx-auto" />
        <p className="mt-4 text-warm-grey text-sm sm:text-base tracking-wide">
          Fictional advice in the spirit of mod culture, sharp style, and
          British music heritage.
        </p>
      </header>

      {/* Question Card */}
      <div className="w-full max-w-xl">
        <div className="bg-white/70 backdrop-blur-sm border border-divider rounded-lg p-5 sm:p-7 shadow-sm">
          <label
            htmlFor="question"
            className="block text-[11px] uppercase tracking-[0.15em] text-warm-grey font-medium mb-3"
          >
            Your Question
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Should I quit my job and start a band?"
            rows={3}
            maxLength={500}
            disabled={loading}
            className="w-full bg-cream/50 border border-divider rounded px-4 py-3 text-charcoal text-sm sm:text-base placeholder:text-warm-grey/60 focus:outline-none focus:border-navy/40 focus:ring-1 focus:ring-navy/20 transition-colors disabled:opacity-50"
          />
          <div className="flex items-center justify-between mt-4 gap-3">
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !question.trim()}
              className="bg-charcoal text-cream px-6 py-2.5 text-sm font-medium tracking-wide rounded hover:bg-charcoal-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                  Thinking...
                </span>
              ) : (
                "Ask"
              )}
            </button>
            {question && (
              <button
                onClick={handleClear}
                className="text-warm-grey text-xs uppercase tracking-wider hover:text-charcoal transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Suggested Questions */}
        {!answer && !loading && (
          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-[0.15em] text-warm-grey font-medium mb-3">
              Or try one of these
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setQuestion(q);
                    handleSubmit(q);
                  }}
                  className="text-xs text-charcoal/70 bg-parchment hover:bg-divider border border-divider/60 px-3 py-1.5 rounded transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-5 p-4 bg-burgundy/5 border border-burgundy/20 rounded text-burgundy text-sm">
            {error}
          </div>
        )}

        {/* Answer Card */}
        {answer && (
          <div className="mt-6 animate-fade-in">
            <div className="border-l-2 border-burgundy bg-white/50 backdrop-blur-sm rounded-r-lg p-5 sm:p-7">
              <p className="text-[11px] uppercase tracking-[0.15em] text-warm-grey font-medium mb-3">
                The Answer
              </p>
              <blockquote className="text-charcoal text-sm sm:text-base leading-relaxed whitespace-pre-line font-serif italic">
                {answer}
              </blockquote>
              <div className="mt-4 flex items-center gap-4">
                <button
                  onClick={handleCopy}
                  className="text-[11px] uppercase tracking-[0.15em] text-warm-grey hover:text-charcoal transition-colors"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
                <span className="text-divider">|</span>
                <button
                  onClick={() => {
                    setAnswer("");
                    setQuestion("");
                  }}
                  className="text-[11px] uppercase tracking-[0.15em] text-warm-grey hover:text-charcoal transition-colors"
                >
                  Ask Another
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && !loading && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-divider" />
              <p className="text-[11px] uppercase tracking-[0.15em] text-warm-grey font-medium">
                Recent Questions
              </p>
              <div className="h-px flex-1 bg-divider" />
            </div>
            <div className="space-y-2">
              {history.map((item) => (
                <button
                  key={item.timestamp}
                  onClick={() => {
                    setQuestion(item.question);
                    setAnswer(item.answer);
                  }}
                  className="w-full text-left text-xs text-charcoal/60 hover:text-charcoal bg-parchment/50 hover:bg-parchment border border-transparent hover:border-divider/40 px-4 py-2.5 rounded transition-colors truncate"
                >
                  {item.question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-16 pb-6 text-center">
        <div className="w-8 h-px bg-divider mx-auto mb-4" />
        <p className="text-[10px] text-warm-grey/70 tracking-wide max-w-sm mx-auto leading-relaxed">
          A creative tribute. Not affiliated with or endorsed by Paul Weller.
          <br />
          Responses are fictional and for entertainment only.
        </p>
      </footer>
    </main>
  );
}
