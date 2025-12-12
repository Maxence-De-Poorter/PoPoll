import type { HttpRequest } from "@azure/functions";

export function corsHeaders(req?: HttpRequest) {
  const allowed = (process.env.ALLOWED_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  const origin = req?.headers.get("origin") ?? "";
  const allowOrigin = allowed.includes(origin) ? origin : allowed[0] ?? "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

export function handleOptions(req: HttpRequest) {
  return { status: 204 as const, headers: corsHeaders(req) };
}
