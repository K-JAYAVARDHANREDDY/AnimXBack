import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { CosmosClient } from '@azure/cosmos';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseName = process.env.COSMOS_DATABASE || 'AnimX';
const containerName = process.env.COSMOS_CONTAINER || 'Animations';

if (!endpoint || !key) {
  console.error("Missing COSMOS_ENDPOINT or COSMOS_KEY in .env.local");
  process.exit(1);
}

const client = new CosmosClient({ endpoint, key });
const DATA_DIR = path.join(process.cwd(), 'data', 'animations');

async function seedDatabase() {
  console.log(`Ensuring database '${databaseName}' exists...`);
  const { database } = await client.databases.createIfNotExists({ id: databaseName });

  console.log(`Ensuring container '${containerName}' exists...`);
  // Using 'id' as the partition key for simplicity, though 'category' or 'engine' could also work
  const { container } = await database.containers.createIfNotExists({
    id: containerName,
    partitionKey: { paths: ['/id'] }
  });

  console.log(`Reading JSON files from ${DATA_DIR}...`);
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

  console.log(`Found ${files.length} animations. Starting data migration...`);

  for (const file of files) {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
    try {
      const data = JSON.parse(raw);
      // Ensure 'id' exists
      if (!data.id) {
        data.id = file.replace('.json', '');
      }
      
      console.log(`Upserting ${data.id}...`);
      await container.items.upsert(data);
    } catch (err) {
      console.error(`Error parsing or inserting ${file}:`, err);
    }
  }

  console.log("Database seed completed successfully.");
}

seedDatabase().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
