import { useState, useEffect } from "react";
import { useUrls, ShortenedUrl } from "../context/UrlContext";
import {
  Copy, Check, Ban, ExternalLink, History, Clock, Infinity,
  MousePointerClick, Search, ChevronDown, AlertTriangle, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatDistanceToNow, format } from "date-fns";

type FilterStatus = "all" | "active" | "expired";

function useNow() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function ExpiryCountdown({ expiresAt, now }: { expiresAt: number; now: number }) {
  const remaining = expiresAt - now;
  if (remaining <= 0) return <span className="text-red-400 text-xs">Expired</span>;

  const totalSecs = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0 || hours > 0) parts.push(`${mins}m`);
  parts.push(`${secs}s`);

  return <span className="text-amber-400 font-mono text-xs">{parts.join(" ")}</span>;
}

function UrlCard({ url, onForceExpire }: { url: ShortenedUrl; onForceExpire: (id: string) => void }) {
  const { isExpired } = useUrls();
  const [copied, setCopied] = useState(false);
  const [confirmExpire, setConfirmExpire] = useState(false);
  const now = useNow();

  const expired = isExpired(url);

  function handleCopy() {
    navigator.clipboard.writeText(url.shortUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleForceExpire() {
    if (!confirmExpire) {
      setConfirmExpire(true);
      setTimeout(() => setConfirmExpire(false), 3000);
    } else {
      onForceExpire(url.id);
      setConfirmExpire(false);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl p-4 sm:p-5 transition-all duration-200"
      style={{
        background: expired
          ? "rgba(255,255,255,0.02)"
          : "rgba(255,255,255,0.04)",
        border: expired
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Status dot */}
        <div className="flex sm:flex-col items-center gap-2 sm:pt-1 shrink-0">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{
              background: expired ? "#6b7280" : "#22c55e",
              boxShadow: expired ? "none" : "0 0 6px rgba(34,197,94,0.6)",
            }}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Short URL row */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="font-mono text-sm"
              style={{ color: expired ? "rgba(255,255,255,0.35)" : "#a78bfa" }}
            >
              {url.shortUrl}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={
                expired
                  ? { background: "rgba(107,114,128,0.15)", color: "#9ca3af", border: "1px solid rgba(107,114,128,0.2)" }
                  : { background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }
              }
            >
              {expired ? "Expired" : "Active"}
            </span>
            {url.forceExpired && (
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                Force expired
              </span>
            )}
          </div>

          {/* Original URL */}
          <a
            href={url.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 group mb-3"
          >
            <p className="text-sm truncate max-w-xs sm:max-w-md"
              style={{ color: expired ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.6)" }}>
              {url.originalUrl}
            </p>
            <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: expired ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.5)" }} />
          </a>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Click count */}
            <div className="flex items-center gap-1.5"
              style={{ color: "rgba(255,255,255,0.45)" }}>
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>{url.clickCount} {url.clickCount === 1 ? "click" : "clicks"}</span>
            </div>

            {/* Created */}
            <div className="flex items-center gap-1.5"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              <Clock className="w-3.5 h-3.5" />
              <span>Created {formatDistanceToNow(url.createdAt, { addSuffix: true })}</span>
            </div>

            {/* Expiry info */}
            <div className="flex items-center gap-1.5">
              {url.expiresAt === null ? (
                <>
                  <Infinity className="w-3.5 h-3.5 text-violet-400/60" />
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>Never expires</span>
                </>
              ) : expired ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-500">
                    Expired {formatDistanceToNow(url.expiresAt, { addSuffix: true })}
                  </span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-400/80" />
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>Expires in{" "}</span>
                  <ExpiryCountdown expiresAt={url.expiresAt} now={now} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Copy */}
          <button
            onClick={handleCopy}
            disabled={expired}
            title={expired ? "Link expired" : "Copy short URL"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
            style={{
              background: copied
                ? "rgba(34,197,94,0.12)"
                : expired
                ? "rgba(255,255,255,0.03)"
                : "rgba(124,58,237,0.12)",
              border: copied
                ? "1px solid rgba(34,197,94,0.25)"
                : expired
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid rgba(124,58,237,0.25)",
              color: copied ? "#4ade80" : expired ? "rgba(255,255,255,0.2)" : "#a78bfa",
              cursor: expired ? "not-allowed" : "pointer",
            }}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>

          {/* Force expire */}
          {!expired && (
            <button
              onClick={handleForceExpire}
              title={confirmExpire ? "Click again to confirm" : "Force expire this URL"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
              style={{
                background: confirmExpire
                  ? "rgba(239,68,68,0.15)"
                  : "rgba(255,255,255,0.04)",
                border: confirmExpire
                  ? "1px solid rgba(239,68,68,0.4)"
                  : "1px solid rgba(255,255,255,0.08)",
                color: confirmExpire ? "#f87171" : "rgba(255,255,255,0.45)",
              }}
            >
              {confirmExpire ? (
                <><AlertTriangle className="w-3.5 h-3.5" /> Confirm?</>
              ) : (
                <><Ban className="w-3.5 h-3.5" /> Expire</>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function HistoryPage() {
  const { urls, forceExpireUrl, isExpired } = useUrls();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = urls.filter((u) => {
    const expired = isExpired(u);
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !expired) ||
      (filter === "expired" && expired);
    const matchesSearch =
      search === "" ||
      u.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
      u.shortUrl.toLowerCase().includes(search.toLowerCase()) ||
      u.shortCode.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeCount = urls.filter((u) => !isExpired(u)).length;
  const expiredCount = urls.filter((u) => isExpired(u)).length;

  const filterLabel =
    filter === "all" ? "All links" : filter === "active" ? "Active" : "Expired";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.3))", border: "1px solid rgba(167,139,250,0.2)" }}>
            <History className="w-4 h-4 text-violet-400" />
          </div>
          <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            URL History
          </h1>
        </div>
        <p className="text-white/40 text-sm">Track and manage all your shortened links</p>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {[
          { label: "Total links", value: urls.length, color: "#a78bfa" },
          { label: "Active", value: activeCount, color: "#4ade80" },
          { label: "Expired", value: expiredCount, color: "#9ca3af" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl px-4 py-3 text-center"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p style={{ color: stat.color, fontSize: "1.4rem", fontWeight: 700, lineHeight: 1.2 }}>
              {stat.value}
            </p>
            <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Search + Filter */}
      {urls.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex gap-3 mb-5"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search URLs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white placeholder:text-white/25 outline-none text-sm"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          </div>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={{
                background: filterOpen ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.05)",
                border: filterOpen ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.1)",
                color: filterOpen ? "#a78bfa" : "rgba(255,255,255,0.6)",
                whiteSpace: "nowrap",
              }}
            >
              <Filter className="w-4 h-4" />
              {filterLabel}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-40 rounded-xl overflow-hidden z-50"
                  style={{ background: "#1e1b3a", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 16px 32px rgba(0,0,0,0.5)" }}
                >
                  {(["all", "active", "expired"] as FilterStatus[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => { setFilter(f); setFilterOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm capitalize transition-colors"
                      style={{
                        color: filter === f ? "#a78bfa" : "rgba(255,255,255,0.65)",
                        background: filter === f ? "rgba(124,58,237,0.15)" : "transparent",
                      }}
                      onMouseEnter={(e) => { if (filter !== f) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                      onMouseLeave={(e) => { if (filter !== f) e.currentTarget.style.background = "transparent"; }}
                    >
                      {f === "all" ? "All links" : f === "active" ? "Active only" : "Expired only"}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* URL list */}
      {urls.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <History className="w-7 h-7 text-white/20" />
          </div>
          <p className="text-white/40 mb-1">No shortened URLs yet</p>
          <p className="text-white/20 text-sm">Head to the Shorten page to create your first link</p>
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-white/40 text-sm">No links match your search or filter.</p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="flex flex-col gap-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((url) => (
              <UrlCard key={url.id} url={url} onForceExpire={forceExpireUrl} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
