import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as auth from "./schema/auth";
import * as quotes from "./schema/quotes";

export * from "./schema/quotes";

export const schema = { ...auth, ...quotes };

export { sqliteTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

const client = createClient({
  url: process.env.DB_URL ?? "",
  authToken: process.env.DB_AUTH_TOKEN ?? "",
});

export const db = drizzle(client, { schema });
