import { CosmosClient, type Container } from "@azure/cosmos";

type CosmosConfig = {
  connectionString: string;
  databaseName: string;
  containerName: string;
};

function getConfig(): CosmosConfig {
  const connectionString = process.env.COSMOS_CONNECTION_STRING ?? "";
  const databaseName = process.env.COSMOS_DB_NAME ?? "strawpoll";
  const containerName = process.env.COSMOS_CONTAINER_NAME ?? "polls";

  if (!connectionString) {
    throw new Error("Missing COSMOS_CONNECTION_STRING env var");
  }

  return { connectionString, databaseName, containerName };
}

let _container: Container | null = null;

export function getPollsContainer(): Container {
  if (_container) return _container;

  const cfg = getConfig();
  const client = new CosmosClient(cfg.connectionString);
  _container = client.database(cfg.databaseName).container(cfg.containerName);
  return _container;
}
