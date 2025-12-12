type VoteResultsProps = {
  options: string[];
  results: number[];
};

export default function VoteResults({ options, results }: VoteResultsProps) {
  const total = results.reduce((a, b) => a + b, 0);

  const rows = options
    .map((option, i) => ({
      option,
      count: results[i] ?? 0,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Total votes : <span className="font-semibold">{total}</span>
      </div>

      {rows.map(({ option, count }) => {
        const percent = total ? Math.round((count / total) * 100) : 0;

        return (
          <div key={option} className="space-y-1">
            <div className="flex items-baseline justify-between gap-3">
              <div className="font-medium text-gray-800 truncate">{option}</div>
              <div className="text-sm text-gray-600 whitespace-nowrap">
                <span className="font-semibold">{count}</span> ({percent}%)
              </div>
            </div>

            <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${percent}%` }}
                aria-label={`${option}: ${count} votes (${percent}%)`}
              />
            </div>
          </div>
        );
      })}

      {rows.length === 0 && (
        <div className="text-sm text-gray-600">Aucun résultat.</div>
      )}
    </div>
  );
}
