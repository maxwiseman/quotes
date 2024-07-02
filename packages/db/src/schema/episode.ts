import { int, text } from "drizzle-orm/sqlite-core";

import { sqliteTable } from "./_table";
import { relations } from "drizzle-orm";
import { quote } from "./quote";
import { season } from "./season";

export const episode = sqliteTable("episode", {
  id: int("id").primaryKey({ autoIncrement: true }),
  seasonId: int("season_id").notNull().references(() => season.id),
  name: text("name").notNull(),
  description: text("description"),
  releaseDate: int("release_date", { mode: "timestamp" }),
});

export const episodeRelations = relations(episode, ({ many, one }) => ({
  quote: many(quote),
  season: one(season, {
    fields: [episode.seasonId],
    references: [season.id]
  })
}))
