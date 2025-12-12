import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isCreate = location.pathname === "/create";
  const isPoll = location.pathname.startsWith("/poll/");

  return (
    <header className="w-full bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10">

      {/* Left side : Title */}
      <h1 className="text-2xl font-bold">
        <Link to="/">PoPolls</Link>
      </h1>

      {/* Right side : Dynamic button */}
      {isHome && (
        <Link
          to="/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Créer un poll
        </Link>
      )}

      {(isCreate || isPoll) && (
        <Link
          to="/"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Retour au menu
        </Link>
      )}
    </header>
  );
}
