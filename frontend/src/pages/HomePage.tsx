import { useEffect, useMemo, useState } from "react";
import { getPolls } from "../api/polls";
import type { Poll } from "../types/poll";
import PollItem from "../components/PollItem";
import Header from "../components/Header";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

type SortMode = "recent" | "votes" | "az";
type VoteFilter = "all" | "withVotes" | "noVotes";

function totalVotes(p: Poll) {
  return (p.results ?? []).reduce((a, b) => a + b, 0);
}

export default function HomePage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [voteFilter, setVoteFilter] = useState<VoteFilter>("all");

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

  const filteredPolls = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = polls;

    if (q) {
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }

    if (voteFilter === "withVotes") {
      list = list.filter((p) => totalVotes(p) > 0);
    } else if (voteFilter === "noVotes") {
      list = list.filter((p) => totalVotes(p) === 0);
    }

    if (sortMode === "votes") {
      list = [...list].sort((a, b) => totalVotes(b) - totalVotes(a));
    } else if (sortMode === "az") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list = [...list];
    }

    return list;
  }, [polls, query, sortMode, voteFilter]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="w-full p-2 border rounded-lg"
              placeholder="Rechercher un sondage…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <select
              className="w-full p-2 border rounded-lg"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
            >
              <option value="recent">Récents (ordre API)</option>
              <option value="votes">Plus votés</option>
              <option value="az">Titre (A→Z)</option>
            </select>

            <select
              className="w-full p-2 border rounded-lg"
              value={voteFilter}
              onChange={(e) => setVoteFilter(e.target.value as VoteFilter)}
            >
              <option value="all">Tous</option>
              <option value="withVotes">Avec votes</option>
              <option value="noVotes">Sans vote</option>
            </select>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            {filteredPolls.length} sondage{filteredPolls.length > 1 ? "s" : ""} affiché
            {filteredPolls.length > 1 ? "s" : ""}
          </div>
        </div>

        {loading && <Spinner />}

        {error && <Alert variant="error">{error}</Alert>}

        {!loading && !error && filteredPolls.length === 0 && (
          <Alert variant="info">Aucun sondage ne correspond à tes filtres.</Alert>
        )}

        {!loading && !error && filteredPolls.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolls.map((p) => (
              <PollItem key={p.id} poll={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
