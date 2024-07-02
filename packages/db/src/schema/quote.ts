import { int, text } from "drizzle-orm/sqlite-core";
import { sqliteTable } from "./_table";
import { relations } from "drizzle-orm";
import { episode } from "./episode";

export const quote = sqliteTable("quote", {
  id: int("id").primaryKey({ autoIncrement: true }),
  episodeId: int("episode_id").notNull().references(() => episode.id),
  text: text("text").notNull(),
  startTime: int("start_time", { mode: "timestamp" }).notNull(),
  endTime: int("end_time", { mode: "timestamp" }).notNull(),
});

export const quoteRelations = relations(quote, ({ one }) => ({
  episode: one(episode, {
    fields: [quote.episodeId],
    references: [episode.id]
  })
}))
