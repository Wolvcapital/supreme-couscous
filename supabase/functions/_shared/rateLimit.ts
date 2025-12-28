const hits = new Map<string, number>();

export function rateLimit(key: string, limit = 30) {
  const count = hits.get(key) ?? 0;
  if (count >= limit) {
    throw new Error("Rate limit exceeded");
  }
  hits.set(key, count + 1);
}
