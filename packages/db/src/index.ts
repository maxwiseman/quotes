import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as auth from "./schema/auth";
import { show } from "./schema/show";
import { season } from "./schema/season";
import { quote } from "./schema/quote";
import { episode } from "./schema/episode";

export const schema = { ...auth, ...show, ...season, ...quote, ...episode };

export { sqliteTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

const client = createClient({
  url: process.env.DB_URL ?? "",
  authToken: process.env.DB_AUTH_TOKEN ?? "",
});

export const db = drizzle(client, { schema });
