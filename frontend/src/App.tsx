import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePollPage from "./pages/CreatePollPage";
import PollPage from "./pages/PollPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreatePollPage />} />
      <Route path="/poll/:id" element={<PollPage />} />
    </Routes>
  );
}
