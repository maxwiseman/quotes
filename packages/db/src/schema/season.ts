import { int, text } from "drizzle-orm/sqlite-core";

import { sqliteTable } from "./_table";
import { relations } from "drizzle-orm";
import { episode } from "./episode";
import { show } from "./show";

export const season = sqliteTable("season", {
  id: int("id").primaryKey({ autoIncrement: true }),
  showId: int("show_id").notNull().references(() => show.id),
  name: text("name").notNull(),
  number: int("number"),
  releaseDate: int("release_date", { mode: "timestamp" }),
});

export const seasonRelations = relations(season, ({ many, one }) => ({
  episode: many(episode),
  show: one(show, {
    fields: [season.showId],
    references: [show.id]
  })
}))
