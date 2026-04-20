// Referrer / traffic-channel classifier shared by the client tracker and the
// server-side `/api/subscribe` attribution logging. Kept isomorphic.

const AI_RE = /chatgpt|openai|perplexity|gemini|bard|claude|copilot|grok|you\.com/i;
const SEARCH_RE = /google|bing|duckduckgo|yandex|ecosia|brave/i;
const SOCIAL_RE = /t\.co|twitter|x\.com|linkedin|facebook|reddit|news\.ycombinator/i;

export type TrafficChannel =
  | 'ai'
  | 'organic_search'
  | 'social'
  | 'direct'
  | 'referral';

export interface ClassifiedTraffic {
  channel: TrafficChannel;
  ai_source: string | null;
}

export function classifyTraffic(
  referrer: string,
  utmSource: string | null,
): ClassifiedTraffic {
  const combined = `${utmSource ?? ''} ${referrer}`;
  if (AI_RE.test(combined)) {
    const match = combined.match(AI_RE)?.[0] ?? utmSource ?? '';
    return { channel: 'ai', ai_source: match.toLowerCase() };
  }
  if (SEARCH_RE.test(referrer)) return { channel: 'organic_search', ai_source: null };
  if (SOCIAL_RE.test(referrer)) return { channel: 'social', ai_source: null };
  if (!referrer) return { channel: 'direct', ai_source: null };
  return { channel: 'referral', ai_source: null };
}
