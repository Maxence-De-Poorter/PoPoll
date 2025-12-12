import { CosmosClient, Container } from "@azure/cosmos";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function getContainer(): Container {
  const connectionString = requireEnv("COSMOS_CONNECTION_STRING");
  const dbName = process.env.COSMOS_DB_NAME ?? "strawpoll";
  const containerName = process.env.COSMOS_CONTAINER_NAME ?? "polls";

  const client = new CosmosClient(connectionString);
  return client.database(dbName).container(containerName);
}
