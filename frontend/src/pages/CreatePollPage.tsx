import { useState } from "react";
import { createPoll } from "../api/polls";
import { useNavigate } from "react-router-dom";
import type { PollMode } from "../types/poll";
import OptionInput from "../components/OptionInput";
import Header from "../components/Header";

export default function CreatePollPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<PollMode>("single");
  const [options, setOptions] = useState<string[]>(["", ""]);

  const updateOption = (index: number, value: string) => {
    const newOpts = [...options];
    newOpts[index] = value;

    if (
      newOpts[newOpts.length - 1] !== "" &&
      newOpts[newOpts.length - 2] !== ""
    ) {
      newOpts.push("");
    }

    setOptions(newOpts);
  };

  const handleCreate = async () => {
    const cleanOptions = options.filter((o) => o.trim() !== "");
    const id = await createPoll({ title, mode, options: cleanOptions });
    navigate(`/poll/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <Header />

      <main className="max-w-xl mx-auto mt-8 bg-white p-6 rounded-lg shadow">
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
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Créer
        </button>
      </main>
    </div>
  );
}
