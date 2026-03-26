import { CosmosClient } from '@azure/cosmos';

// Environment variables
const endpoint = process.env.COSMOS_ENDPOINT || 'https://localhost:8081';
const key = process.env.COSMOS_KEY || 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==';
export const databaseName = process.env.COSMOS_DATABASE || 'AnimX';
export const containerName = process.env.COSMOS_CONTAINER || 'Animations';

// Create a singleton instance of the Cosmos client
let client: CosmosClient | null = null;

export function getCosmosClient(): CosmosClient {
  if (!client) {
    if (!endpoint || !key) {
      console.warn('Azure Cosmos DB credentials (COSMOS_ENDPOINT, COSMOS_KEY) are missing. Please set them in your .env.local file.');
    }
    client = new CosmosClient({ endpoint, key });
  }
  return client;
}

export async function getContainer() {
  const cosmosClient = getCosmosClient();
  const database = cosmosClient.database(databaseName);
  const container = database.container(containerName);
  return container;
}
