const RECENT_VIEWS_KEY = 'phethagatsa_recent_views_v1';
const MAX_RECENT_VIEWS = 8;

export function getRecentViewIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_VIEWS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addRecentView(productId: string): string[] {
  if (!productId) return getRecentViewIds();
  try {
    const current = getRecentViewIds();
    const filtered = current.filter((id) => id !== productId);
    const updated = [productId, ...filtered].slice(0, MAX_RECENT_VIEWS);
    localStorage.setItem(RECENT_VIEWS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearRecentViews(): void {
  try {
    localStorage.removeItem(RECENT_VIEWS_KEY);
  } catch {
    // Ignore storage errors
  }
}
