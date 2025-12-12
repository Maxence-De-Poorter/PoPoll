import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPoll, votePoll } from "../api/polls";
import type { Poll } from "../types/poll";
import VoteResults from "../components/VoteResults";
import Header from "../components/Header";

export default function PollPage() {
  const { id } = useParams();
  const pollId = id as string;

  const [poll, setPoll] = useState<Poll | undefined>();
  const [selected, setSelected] = useState<string[]>([]);

  const voted = localStorage.getItem(`poll_${pollId}_voted`) === "true";

  useEffect(() => {
    if (pollId) {
      getPoll(pollId).then(setPoll);
    }
  }, [pollId]);

  const submitVote = async () => {
    if (!poll) return;
    await votePoll(pollId, selected);
    localStorage.setItem(`poll_${pollId}_voted`, "true");
    window.location.reload();
  };

  if (!poll) return <div className="p-6">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      
      <Header />

      <main className="max-w-xl mx-auto mt-8 bg-white p-6 rounded-lg shadow">

        {/* 🔥 Le titre est maintenant visible dans la page */}
        <h2 className="text-xl font-bold mb-6 text-center">{poll.title}</h2>

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

            <button
              onClick={submitVote}
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mt-4"
            >
              Voter
            </button>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4">Résultats</h3>
            <VoteResults options={poll.options} results={poll.results} />
          </>
        )}

      </main>
    </div>
  );
}
