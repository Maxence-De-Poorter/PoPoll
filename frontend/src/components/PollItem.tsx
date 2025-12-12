import { Link } from "react-router-dom";
import type { Poll } from "../types/poll";

interface PollItemProps {
  poll: Poll;
}

export default function PollItem({ poll }: PollItemProps) {
  const totalVotes = (poll.results ?? []).reduce((a, b) => a + b, 0);

  return (
    <Link
      to={`/poll/${poll.id}`}
      className="bg-white p-6 rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition block"
    >
      <h2 className="text-xl font-semibold mb-2">{poll.title}</h2>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{poll.options.length} options</span>
        <span className="font-medium">
          {totalVotes} vote{totalVotes > 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}
