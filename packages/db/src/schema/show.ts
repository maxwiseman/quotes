import { int, text } from "drizzle-orm/sqlite-core";

import { sqliteTable } from "./_table";
import { relations } from "drizzle-orm";
import { season } from "./season";

export const show = sqliteTable("show", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
});

export const showRelations = relations(show, ({ many }) => ({
  season: many(season)
}))
