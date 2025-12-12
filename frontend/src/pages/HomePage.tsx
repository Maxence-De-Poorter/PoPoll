import { useEffect, useState } from "react";
import { getPolls } from "../api/polls";
import type { Poll } from "../types/poll";
import PollItem from "../components/PollItem";
import Header from "../components/Header";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

export default function HomePage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getPolls()
      .then(setPolls)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Erreur inconnue")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto p-6">
        {loading && <Spinner />}

        {error && <Alert variant="error">{error}</Alert>}

        {!loading && !error && polls.length === 0 && (
          <Alert variant="info">Aucun sondage pour le moment.</Alert>
        )}

        {!loading && !error && polls.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((p) => (
              <PollItem key={p.id} poll={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
