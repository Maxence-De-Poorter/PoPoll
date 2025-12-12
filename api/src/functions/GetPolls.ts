import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { corsHeaders, handleOptions } from "../shared/cors.js";
import { getPollsContainer } from "../db/cosmos.js";

export async function GetPolls(req: HttpRequest): Promise<HttpResponseInit> {
  if (req.method === "OPTIONS") return handleOptions(req);

  const container = getPollsContainer();
  const { resources } = await container.items
    .query("SELECT c.id, c.title, c.mode, c.options, c.results, c.createdAt FROM c ORDER BY c.createdAt DESC")
    .fetchAll();

  return { status: 200, jsonBody: resources, headers: corsHeaders(req) };
}

app.http("GetPolls", {
  methods: ["GET", "OPTIONS"],
  route: "polls",
  authLevel: "anonymous",
  handler: GetPolls
});
