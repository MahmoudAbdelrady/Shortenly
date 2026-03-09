import { useState, useRef } from "react";
import { useUrls, ShortenedUrl } from "../context/UrlContext";
import { Link2, Copy, Check, ChevronDown, Clock, Infinity, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const EXPIRY_OPTIONS = [
  { label: "Never expires", value: null },
  { label: "5 minutes", value: 5 },
  { label: "10 minutes", value: 10 },
  { label: "15 minutes", value: 15 },
  { label: "20 minutes", value: 20 },
  { label: "25 minutes", value: 25 },
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "2 hours", value: 120 },
  { label: "6 hours", value: 360 },
  { label: "12 hours", value: 720 },
  { label: "24 hours", value: 1440 },
];

export default function ShortenPage() {
  const { addUrl } = useUrls();
  const [url, setUrl] = useState("");
  const [expiry, setExpiry] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [result, setResult] = useState<ShortenedUrl | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = EXPIRY_OPTIONS.find((o) => o.value === expiry)!;

  function validateUrl(value: string): boolean {
    try {
      const u = new URL(value);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL.");
      return;
    }
    if (!validateUrl(trimmed)) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setLoading(true);
    // Simulate a brief delay for effect
    setTimeout(() => {
      const shortened = addUrl(trimmed, expiry);
      setResult(shortened);
      setLoading(false);
    }, 600);
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result.shortUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleReset() {
    setResult(null);
    setUrl("");
    setExpiry(null);
    setCopied(false);
    setError("");
  }

  const selectedLabel = selectedOption.label;

  return (
    <div className="min-h-[calc(100vh-64px-56px)] flex flex-col items-center justify-center px-4 py-12">
      {/* Hero text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs"
          style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(167,139,250,0.3)", color: "#c4b5fd" }}>
          <Sparkles className="w-3 h-3" />
          Fast & Simple URL Shortener
        </div>
        <h1 className="text-white mb-3" style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.03em" }}>
          Shorten any URL<br />
          <span style={{ background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            in seconds
          </span>
        </h1>
        <p className="text-white/50 max-w-md mx-auto text-sm">
          Paste your long URL below and get a clean, shareable short link with optional expiry control.
        </p>
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-2xl"
      >
        {!result ? (
          <div className="rounded-2xl p-6 sm:p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)" }}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* URL Input */}
              <div className="flex flex-col gap-2">
                <label className="text-white/70 text-sm">Your long URL</label>
                <div className="relative flex items-center">
                  <Link2 className="absolute left-4 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); setError(""); }}
                    placeholder="https://example.com/very/long/url/that/needs/shortening"
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder:text-white/25 outline-none transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: error ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(255,255,255,0.1)",
                      fontSize: "0.9rem",
                    }}
                    onFocus={(e) => {
                      if (!error) e.currentTarget.style.border = "1px solid rgba(167,139,250,0.5)";
                    }}
                    onBlur={(e) => {
                      if (!error) e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
                    }}
                  />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              {/* Expiry selector */}
              <div className="flex flex-col gap-2">
                <label className="text-white/70 text-sm">Expiry duration</label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-white transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: dropdownOpen ? "1px solid rgba(167,139,250,0.5)" : "1px solid rgba(255,255,255,0.1)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {expiry === null ? (
                        <Infinity className="w-4 h-4 text-violet-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-violet-400" />
                      )}
                      <span>{selectedLabel}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-50 w-full mt-2 rounded-xl overflow-hidden"
                      style={{ background: "#1e1b3a", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
                    >
                      <div className="max-h-56 overflow-y-auto">
                        {EXPIRY_OPTIONS.map((option) => (
                          <button
                            key={String(option.value)}
                            type="button"
                            onClick={() => { setExpiry(option.value); setDropdownOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-150"
                            style={{
                              color: expiry === option.value ? "#a78bfa" : "rgba(255,255,255,0.75)",
                              background: expiry === option.value ? "rgba(124,58,237,0.15)" : "transparent",
                            }}
                            onMouseEnter={(e) => {
                              if (expiry !== option.value) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                            }}
                            onMouseLeave={(e) => {
                              if (expiry !== option.value) e.currentTarget.style.background = "transparent";
                            }}
                          >
                            {option.value === null ? (
                              <Infinity className="w-4 h-4 text-violet-400 shrink-0" />
                            ) : (
                              <Clock className="w-4 h-4 text-violet-400/70 shrink-0" />
                            )}
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
                <p className="text-white/30 text-xs">
                  {expiry === null
                    ? "This link will never expire and remain active indefinitely."
                    : `This link will expire ${selectedLabel} after creation.`}
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: loading ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  boxShadow: loading ? "none" : "0 4px 20px rgba(124,58,237,0.4)",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Shortening...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Shorten URL
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.25)", backdropFilter: "blur(16px)" }}
          >
            {/* Success header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
                <Check className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-white" style={{ fontSize: "1.1rem" }}>URL Shortened Successfully!</h2>
                <p className="text-white/40 text-xs mt-0.5">Your link is ready to share</p>
              </div>
            </div>

            {/* Short URL */}
            <div className="mb-4">
              <label className="text-white/50 text-xs mb-2 block">Short URL</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center px-4 py-3 rounded-xl"
                  style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)" }}>
                  <span className="text-violet-300 text-sm font-mono truncate">{result.shortUrl}</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all duration-200 shrink-0"
                  style={{
                    background: copied ? "rgba(34,197,94,0.15)" : "rgba(124,58,237,0.2)",
                    border: copied ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(124,58,237,0.3)",
                    color: copied ? "#4ade80" : "#a78bfa",
                  }}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Original URL */}
            <div className="mb-6">
              <label className="text-white/50 text-xs mb-2 block">Original URL</label>
              <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-white/60 text-sm truncate">{result.originalUrl}</p>
              </div>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {result.expiresAt === null ? (
                  <><Infinity className="w-3 h-3 text-violet-400" /><span className="text-white/60">Never expires</span></>
                ) : (
                  <><Clock className="w-3 h-3 text-violet-400" /><span className="text-white/60">Expires in {selectedLabel}</span></>
                )}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-white/60">Active</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl text-sm transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
              >
                Shorten another
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex gap-8 mt-10 text-center"
      >
        {[
          { value: "Instant", label: "No sign-up needed" },
          { value: "5-min", label: "Interval options" },
          { value: "∞", label: "Never-expire option" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="text-violet-400" style={{ fontWeight: 700, fontSize: "1.1rem" }}>{stat.value}</span>
            <span className="text-white/30 text-xs">{stat.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function Zap({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
