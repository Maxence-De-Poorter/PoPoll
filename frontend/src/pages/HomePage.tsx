import { useEffect, useState } from "react";
import { getPolls } from "../api/polls";
import type { Poll } from "../types/poll";
import PollItem from "../components/PollItem";
import Header from "../components/Header";  // ⬅️ import du header dynamique

export default function HomePage() {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    getPolls().then(setPolls);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER DYNAMIQUE */}
      <Header />

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((p) => (
            <PollItem key={p.id} poll={p} />
          ))}
        </div>
      </main>
    </div>
  );
}
