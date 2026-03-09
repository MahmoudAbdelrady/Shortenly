import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: number;
  expiresAt: number | null; // null = never expires
  clickCount: number;
  forceExpired: boolean;
}

interface UrlContextType {
  urls: ShortenedUrl[];
  addUrl: (originalUrl: string, expiryMinutes: number | null) => ShortenedUrl;
  forceExpireUrl: (id: string) => void;
  incrementClick: (shortCode: string) => void;
  isExpired: (url: ShortenedUrl) => boolean;
}

const UrlContext = createContext<UrlContextType | null>(null);

const STORAGE_KEY = "url_shortener_history";
const BASE_URL = "https://snip.ly/";

function generateShortCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function UrlProvider({ children }: { children: React.ReactNode }) {
  const [urls, setUrls] = useState<ShortenedUrl[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
  }, [urls]);

  const isExpired = useCallback((url: ShortenedUrl): boolean => {
    if (url.forceExpired) return true;
    if (url.expiresAt === null) return false;
    return Date.now() > url.expiresAt;
  }, []);

  const addUrl = useCallback((originalUrl: string, expiryMinutes: number | null): ShortenedUrl => {
    const shortCode = generateShortCode();
    const newUrl: ShortenedUrl = {
      id: crypto.randomUUID(),
      originalUrl,
      shortCode,
      shortUrl: `${BASE_URL}${shortCode}`,
      createdAt: Date.now(),
      expiresAt: expiryMinutes !== null ? Date.now() + expiryMinutes * 60 * 1000 : null,
      clickCount: 0,
      forceExpired: false,
    };
    setUrls((prev) => [newUrl, ...prev]);
    return newUrl;
  }, []);

  const forceExpireUrl = useCallback((id: string) => {
    setUrls((prev) =>
      prev.map((u) => (u.id === id ? { ...u, forceExpired: true } : u))
    );
  }, []);

  const incrementClick = useCallback((shortCode: string) => {
    setUrls((prev) =>
      prev.map((u) =>
        u.shortCode === shortCode ? { ...u, clickCount: u.clickCount + 1 } : u
      )
    );
  }, []);

  return (
    <UrlContext.Provider value={{ urls, addUrl, forceExpireUrl, incrementClick, isExpired }}>
      {children}
    </UrlContext.Provider>
  );
}

export function useUrls() {
  const ctx = useContext(UrlContext);
  if (!ctx) throw new Error("useUrls must be used within UrlProvider");
  return ctx;
}
