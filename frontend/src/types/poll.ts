export interface Poll {
  id: string;
  title: string;
  mode: "single" | "multiple";
  options: string[];
  results: number[];
}

export type PollMode = "single" | "multiple";
