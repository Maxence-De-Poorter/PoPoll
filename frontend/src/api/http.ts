export async function getJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);

  let data: any = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
  }

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `Erreur HTTP ${res.status} (${res.statusText})`;
    throw new Error(msg);
  }

  return data as T;
}
