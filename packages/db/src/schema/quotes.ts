import { relations } from "drizzle-orm";
import { int, text } from "drizzle-orm/sqlite-core";

import { sqliteTable } from "./_table";

export const episode = sqliteTable("episode", {
  id: int("id").primaryKey({ autoIncrement: true }),
  seasonId: int("season_id")
    .notNull()
    .references(() => season.id),
  number: int("number"),
  title: text("name"),
  filePath: text("file_path").notNull(),
  description: text("description"),
  releaseDate: int("release_date", { mode: "timestamp" }),
});

export const episodeRelations = relations(episode, ({ many, one }) => ({
  quote: many(quote),
  season: one(season, {
    fields: [episode.seasonId],
    references: [season.id],
  }),
}));

export const quote = sqliteTable("quote", {
  id: int("id").primaryKey({ autoIncrement: true }),
  index: int("index").notNull(),
  episodeId: int("episode_id")
    .notNull()
    .references(() => episode.id),
  text: text("text").notNull(),
  startTime: int("start_time").notNull(),
  endTime: int("end_time").notNull(),
  character: text("character"),
  featured: int("featured", { mode: "boolean" })
});

export const quoteRelations = relations(quote, ({ one }) => ({
  episode: one(episode, {
    fields: [quote.episodeId],
    references: [episode.id],
  }),
}));

export const season = sqliteTable("season", {
  id: int("id").primaryKey({ autoIncrement: true }),
  showId: int("show_id")
    .notNull()
    .references(() => show.id),
  title: text("name").notNull(),
  number: int("number"),
  releaseDate: int("release_date", { mode: "timestamp" }),
  streamingLink: text("streaming_link"),
  streamingIconUrl: text("streaming_icon_url")
});

export const seasonRelations = relations(season, ({ many, one }) => ({
  episode: many(episode),
  show: one(show, {
    fields: [season.showId],
    references: [show.id],
  }),
}));

export const show = sqliteTable("show", {
  id: int("id").primaryKey({ autoIncrement: true }),
  title: text("name").notNull(),
  dirName: text("dir_name").notNull(),
  description: text("description"),
  iconUrl: text("icon_url").notNull(),
  posterImageUrl: text("poster_image_url").notNull()
});

export const showRelations = relations(show, ({ many }) => ({
  season: many(season),
}));
