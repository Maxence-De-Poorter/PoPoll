import { CosmosClient, type Container } from "@azure/cosmos";

let _container: Container | null = null;

export async function getPollsContainer(): Promise<Container> {
  if (_container) return _container;

  const connectionString = process.env.COSMOS_CONNECTION_STRING ?? "";
  const databaseName = process.env.COSMOS_DB_NAME ?? "strawpoll";
  const containerName = process.env.COSMOS_CONTAINER_NAME ?? "polls";
  const partitionKeyPath = process.env.COSMOS_PARTITION_KEY_PATH ?? "/id";

  if (!connectionString) throw new Error("Missing COSMOS_CONNECTION_STRING");

  const client = new CosmosClient(connectionString);

  const { database } = await client.databases.createIfNotExists({ id: databaseName });

  const { container } = await database.containers.createIfNotExists({
    id: containerName,
    partitionKey: { paths: [partitionKeyPath] }
  });

  _container = container;
  return _container;
}
