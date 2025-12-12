import { Link } from "react-router-dom";
import type { Poll } from "../types/poll";

interface PollItemProps {
  poll: Poll;
}

export default function PollItem({ poll }: PollItemProps) {
  return (
    <Link
      to={`/poll/${poll.id}`}
      className="bg-white p-6 rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition block"
    >
      <h2 className="text-xl font-semibold mb-2">{poll.title}</h2>
      <p className="text-sm text-gray-500">{poll.options.length} options</p>
    </Link>
  );
}
