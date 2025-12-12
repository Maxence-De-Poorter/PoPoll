import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { corsHeaders, handleOptions } from "../shared/cors.js";
import { getPollsContainer } from "../db/cosmos.js";

export async function GetPoll(req: HttpRequest): Promise<HttpResponseInit> {
  if (req.method === "OPTIONS") return handleOptions(req);

  const id = req.params.id;
  if (!id) return { status: 400, jsonBody: { error: "Missing id" }, headers: corsHeaders(req) };

  const container = getPollsContainer();
  try {
    const { resource } = await container.item(id, id).read(); // partitionKey = id (on fera pareil en IaC)
    if (!resource) return { status: 404, jsonBody: { error: "Poll not found" }, headers: corsHeaders(req) };
    return { status: 200, jsonBody: resource, headers: corsHeaders(req) };
  } catch {
    return { status: 404, jsonBody: { error: "Poll not found" }, headers: corsHeaders(req) };
  }
}

app.http("GetPoll", {
  methods: ["GET", "OPTIONS"],
  route: "polls/{id}",
  authLevel: "anonymous",
  handler: GetPoll
});
