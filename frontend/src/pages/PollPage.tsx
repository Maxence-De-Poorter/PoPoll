import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPoll, votePoll } from "../api/polls";
import type { Poll } from "../types/poll";
import VoteResults from "../components/VoteResults";
import Header from "../components/Header";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

export default function PollPage() {
  const { id } = useParams();
  const pollId = id as string;

  const [poll, setPoll] = useState<Poll | undefined>();
  const [selected, setSelected] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const voted = localStorage.getItem(`poll_${pollId}_voted`) === "true";

  // 1) Chargement initial du poll
  useEffect(() => {
    if (!pollId) return;

    setLoading(true);
    setError(null);

    getPoll(pollId)
      .then(setPoll)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Erreur inconnue")
      )
      .finally(() => setLoading(false));
  }, [pollId]);

  // 2) LIVE RESULTS : rafraîchit toutes les 3s quand l'utilisateur a voté
  useEffect(() => {
    if (!pollId) return;
    if (!voted) return; // live uniquement sur la page "résultats"

    const interval = setInterval(() => {
      getPoll(pollId)
        .then(setPoll)
        .catch(() => {
          // on évite de spam l'UI si une requête échoue temporairement
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [pollId, voted]);

  const canVote = selected.length > 0 && !submitting;

  const submitVote = async () => {
    if (!poll || !canVote) return;

    setSubmitting(true);
    setError(null);

    try {
      await votePoll(pollId, selected);
      localStorage.setItem(`poll_${pollId}_voted`, "true");

      // on récupère les résultats tout de suite
      const updated = await getPoll(pollId);
      setPoll(updated);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-xl mx-auto mt-8 bg-white p-6 rounded-lg shadow">
        {loading && <Spinner />}

        {error && <Alert variant="error">{error}</Alert>}

        {!loading && poll && (
          <>
            <h2 className="text-xl font-bold mb-6 text-center">{poll.title}</h2>

            {submitting && <Spinner label="Envoi du vote…" />}

            {!voted ? (
              <>
                <h3 className="text-lg font-semibold mb-4">Vote</h3>

                {poll.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-3 mb-2">
                    <input
                      type={poll.mode === "single" ? "radio" : "checkbox"}
                      name="vote"
                      checked={selected.includes(opt)}
                      value={opt}
                      onChange={() => {
                        if (poll.mode === "single") {
                          setSelected([opt]);
                        } else {
                          setSelected((prev) =>
                            prev.includes(opt)
                              ? prev.filter((x) => x !== opt)
                              : [...prev, opt]
                          );
                        }
                      }}
                    />
                    <span>{opt}</span>
                  </label>
                ))}

                {selected.length === 0 && (
                  <Alert variant="info">Sélectionne au moins une option.</Alert>
                )}

                <button
                  onClick={submitVote}
                  disabled={!canVote}
                  className={`w-full p-3 rounded-lg transition mt-4 ${
                    canVote
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {submitting ? "Envoi…" : "Voter"}
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Résultats</h3>
                  <div className="text-xs text-gray-500">Live</div>
                </div>

                <VoteResults options={poll.options} results={poll.results} />

                <div className="mt-4 text-xs text-gray-500">
                  Actualisation automatique toutes les 3 secondes.
                </div>
              </>
            )}
          </>
        )}

        {!loading && !poll && !error && (
          <Alert variant="info">Sondage introuvable.</Alert>
        )}
      </main>
    </div>
  );
}
