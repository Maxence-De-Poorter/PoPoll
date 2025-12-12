import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { corsHeaders, handleOptions } from "../shared/cors.js";
import { getPollsContainer } from "../db/cosmos.js";

interface VotePollBody {
  selections: string[];
}

export async function VotePoll(req: HttpRequest): Promise<HttpResponseInit> {
  if (req.method === "OPTIONS") return handleOptions(req);

  const id = req.params.id;
  const body = (await req.json()) as Partial<VotePollBody>;

  if (!id || !Array.isArray(body?.selections) || body.selections.length < 1) {
    return { status: 400, jsonBody: { error: "Invalid body" }, headers: corsHeaders(req) };
  }

  const container = await getPollsContainer();

  // Lire
  const { resource: poll } = await container.item(id, id).read<any>();
  if (!poll) {
    return { status: 404, jsonBody: { error: "Poll not found" }, headers: corsHeaders(req) };
  }

  // Appliquer vote
  poll.options.forEach((opt: string, i: number) => {
    if (body.selections!.includes(opt)) poll.results[i] = (poll.results[i] ?? 0) + 1;
  });

  // Écrire (remplace)
  await container.items.upsert(poll);

  return { status: 200, jsonBody: { ok: true }, headers: corsHeaders(req) };
}

app.http("VotePoll", {
  methods: ["POST", "OPTIONS"],
  route: "polls/{id}/vote",
  authLevel: "anonymous",
  handler: VotePoll
});
