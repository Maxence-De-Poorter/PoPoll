import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { v4 as uuid } from "uuid";
import { corsHeaders, handleOptions } from "../shared/cors.js";
import { getPollsContainer } from "../db/cosmos.js";

interface CreatePollBody {
  title: string;
  mode: "single" | "multiple";
  options: string[];
}

export async function CreatePoll(req: HttpRequest): Promise<HttpResponseInit> {
  if (req.method === "OPTIONS") return handleOptions(req);

  const body = (await req.json()) as Partial<CreatePollBody>;
  if (!body?.title || !body?.mode || !Array.isArray(body.options) || body.options.length < 2) {
    return { status: 400, jsonBody: { error: "Invalid body" }, headers: corsHeaders(req) };
  }

  const id = uuid();
  const poll = {
    id,                    // obligatoire pour Cosmos (id)
    title: body.title,
    mode: body.mode,
    options: body.options,
    results: body.options.map(() => 0),
    createdAt: new Date().toISOString()
  };

  const container = await getPollsContainer();
  await container.items.create(poll);

  return { status: 200, jsonBody: { id }, headers: corsHeaders(req) };
}

app.http("CreatePoll", {
  methods: ["POST", "OPTIONS"],
  route: "polls",
  authLevel: "anonymous",
  handler: CreatePoll
});
