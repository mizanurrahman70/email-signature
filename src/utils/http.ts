interface ErrorBody {
  error?: string | { message?: string };
}

/**
 * fetch + JSON parse that throws a readable Error on non-2xx responses.
 * Understands both `{ error: "msg" }` and `{ error: { message: "msg" } }`.
 */
export async function fetchJson<T>(url: string, init: RequestInit, fallbackError: string): Promise<T> {
  const response = await fetch(url, init);
  const data = (await response.json().catch(() => ({}))) as T & ErrorBody;

  if (!response.ok) {
    throw new Error(readErrorMessage(data) ?? fallbackError);
  }
  return data;
}

function readErrorMessage({ error }: ErrorBody): string | undefined {
  return typeof error === "string" ? error : error?.message;
}
