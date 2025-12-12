const API_URL = import.meta.env.VITE_API_URL ?? "https://api-popoll-dev-vqg41f.azurewebsites.net";

import type { Poll } from "../types/poll";
import { getJson } from "./http";

export function getPolls(): Promise<Poll[]> {
  return getJson(`${API_URL}/polls`);
}

export function getPoll(id: string): Promise<Poll> {
  return getJson(`${API_URL}/polls/${id}`);
}

interface CreatePollData {
  title: string;
  mode: "single" | "multiple";
  options: string[];
}

export async function createPoll(data: CreatePollData): Promise<string> {
  const json = await getJson<{ id: string }>(`${API_URL}/polls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return json.id;
}

export function votePoll(id: string, selections: string[]): Promise<void> {
  return getJson(`${API_URL}/polls/${id}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ selections }),
  });
}
