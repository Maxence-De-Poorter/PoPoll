import express from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";
import { getContainer } from "./db/cosmos";

type PollMode = "single" | "multiple";

type Poll = {
  id: string;
  title: string;
  mode: PollMode;
  options: string[];
  results: number[];
};

const app = express();
app.use(express.json());

const allowedOrigins = (process.env.ALLOWED_ORIGIN ?? "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // curl / server-to-server
      if (allowedOrigins.length === 0) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);

const container = getContainer();

// Healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

// GET /polls
app.get("/polls", async (_req, res) => {
  const { resources } = await container.items.query<Poll>("SELECT * FROM c").fetchAll();
  res.json(resources);
});

// GET /polls/:id
app.get("/polls/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const { resource } = await container.item(id, id).read<Poll>();
    if (!resource) return res.status(404).json({ error: "Poll not found" });
    return res.json(resource);
  } catch {
    return res.status(404).json({ error: "Poll not found" });
  }
});

// POST /polls
app.post("/polls", async (req, res) => {
  const body = req.body as { title: string; mode: PollMode; options: string[] };

  if (!body?.title || !body?.mode || !Array.isArray(body.options) || body.options.length < 2) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const poll: Poll = {
    id: uuid(),
    title: body.title,
    mode: body.mode,
    options: body.options,
    results: body.options.map(() => 0)
  };

  await container.items.create(poll);
  return res.status(200).json({ id: poll.id });
});

// POST /polls/:id/vote
app.post("/polls/:id/vote", async (req, res) => {
  const id = req.params.id;
  const body = req.body as { selections: string[] };

  if (!Array.isArray(body?.selections)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const { resource } = await container.item(id, id).read<Poll>().catch(() => ({ resource: null as any }));
  if (!resource) return res.status(404).json({ error: "Poll not found" });

  const poll = resource;
poll.options.forEach((opt: string, i: number) => {
  if (body.selections.includes(opt)) {
    poll.results[i] = (poll.results[i] ?? 0) + 1;
  }
});



  await container.items.upsert(poll);
  return res.status(200).json({ ok: true });
});

const port = Number(process.env.PORT ?? 8080);
app.listen(port, () => console.log(`API listening on :${port}`));
