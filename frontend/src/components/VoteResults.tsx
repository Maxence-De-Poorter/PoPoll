interface VoteResultsProps {
  options: string[];
  results: number[];
}

export default function VoteResults({ options, results }: VoteResultsProps) {
  const max = Math.max(...results, 1);

  return (
    <div className="space-y-4 mt-6">
      {options.map((opt, i) => {
        const percent = Math.round((results[i] / max) * 100);

        return (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span>{opt}</span>
              <span>{results[i]} votes</span>
            </div>

            <div className="w-full bg-gray-200 h-3 rounded">
              <div
                className="bg-blue-600 h-3 rounded"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
