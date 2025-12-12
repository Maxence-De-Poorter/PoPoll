const API_URL = "http://localhost:7071/api";

import type { Poll } from "../types/poll";

export async function getPolls(): Promise<Poll[]> {
  const res = await fetch(`${API_URL}/polls`);
  return res.json();
}

export async function getPoll(id: string): Promise<Poll> {
  const res = await fetch(`${API_URL}/polls/${id}`);
  return res.json();
}

interface CreatePollData {
  title: string;
  mode: "single" | "multiple";
  options: string[];
}

export async function createPoll(data: CreatePollData): Promise<string> {
  const res = await fetch(`${API_URL}/polls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.id; // UUID string
}

export async function votePoll(id: string, selections: string[]): Promise<void> {
  await fetch(`${API_URL}/polls/${id}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ selections }),
  });
}
