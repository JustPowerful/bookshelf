import "dotenv/config";

import { client, db } from "@/database";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const main = async (): Promise<void> => {
  await migrate(db, { migrationsFolder: "./drizzle" });
  await client.end();
  process.exit(0);
};

void main();
