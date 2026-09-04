const API_BASE_URL = "http://localhost:8080";

/**
 * Central fetch wrapper: resolves against the API base URL, JSON-encodes a
 * given `body`, and normalizes non-OK responses into a thrown Error so every
 * caller shares the same error shape instead of re-implementing this check.
 */
export async function apiRequest(path, { body, ...options } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: body ? { "Content-Type": "application/json", ...options.headers } : options.headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/** Normalizes a date-only input (yyyy-mm-dd) or a full ISO string into the
 * LocalDateTime shape the backend expects, so callers don't hand-roll this. */
export function normalizeDueDate(dueDate) {
  if (!dueDate) return null;
  return dueDate.includes("T") ? dueDate : `${dueDate}T00:00:00`;
}
