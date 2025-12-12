import { useMemo, useState } from "react";
import { createPoll } from "../api/polls";
import { useNavigate } from "react-router-dom";
import type { PollMode } from "../types/poll";
import OptionInput from "../components/OptionInput";
import Header from "../components/Header";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";

export default function CreatePollPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<PollMode>("single");
  const [options, setOptions] = useState<string[]>(["", ""]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Options nettoyées
  const cleanOptions = useMemo(
    () => options.map((o) => o.trim()).filter((o) => o !== ""),
    [options]
  );

  // 🔹 Détection des doublons (insensible à la casse)
  const normalizedOptions = cleanOptions.map((o) => o.toLowerCase());
  const hasDuplicates =
    new Set(normalizedOptions).size !== normalizedOptions.length;

  // 🔹 Conditions de création
  const canCreate =
    title.trim().length > 0 &&
    cleanOptions.length >= 2 &&
    !hasDuplicates &&
    !submitting;

  const updateOption = (index: number, value: string) => {
    const newOpts = [...options];
    newOpts[index] = value;

    if (
      newOpts[newOpts.length - 1]?.trim() !== "" &&
      newOpts[newOpts.length - 2]?.trim() !== ""
    ) {
      newOpts.push("");
    }

    setOptions(newOpts);
  };

  const handleCreate = async () => {
    if (!canCreate) return;

    setSubmitting(true);
    setError(null);

    try {
      const id = await createPoll({
        title: title.trim(),
        mode,
        options: cleanOptions,
      });

      navigate(`/poll/${id}`);
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
        {error && <Alert variant="error">{error}</Alert>}

        {submitting && <Spinner label="Création du sondage…" />}

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Titre du poll</span>
          <input
            className="mt-1 w-full p-2 border rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex : Votre film préféré ?"
          />
        </label>

        <h3 className="text-lg font-semibold mb-2">Options</h3>
        {options.map((opt, i) => (
          <OptionInput
            key={i}
            value={opt}
            index={i}
            onChange={(v) => updateOption(i, v)}
          />
        ))}

        {cleanOptions.length < 2 && (
          <Alert variant="info">Ajoute au moins 2 options.</Alert>
        )}

        {hasDuplicates && (
          <Alert variant="error">
            Les options doivent être uniques (pas de doublons).
          </Alert>
        )}

        <h3 className="text-lg font-semibold mt-6 mb-2">Mode de vote</h3>
        <div className="flex gap-6 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={mode === "single"}
              onChange={() => setMode("single")}
            />
            Une seule réponse
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={mode === "multiple"}
              onChange={() => setMode("multiple")}
            />
            Plusieurs réponses
          </label>
        </div>

        <button
          onClick={handleCreate}
          disabled={!canCreate}
          className={`w-full p-3 rounded-lg transition ${
            canCreate
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {submitting ? "Création…" : "Créer"}
        </button>
      </main>
    </div>
  );
}
