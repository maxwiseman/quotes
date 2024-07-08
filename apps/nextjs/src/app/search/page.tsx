import { db, desc, gt, quote, sql } from "@quotes/db"
import type { episode } from "@quotes/db";
import { ResultCard } from "../_components/result-card"
import { notFound } from "next/navigation"

export default async function Page({ searchParams }: { searchParams?: { q?: string } }): Promise<React.ReactElement> {
  if (typeof searchParams?.q !== "string") notFound()
  const data = await db.query.quote.findMany({
    with: {
      episode: true,
    },
    where: gt(sql`jaro_winkler(lower(${quote.text}), lower(${searchParams.q}))`, 0.65),
    orderBy: desc(sql`jaro_winkler(lower(${quote.text}), lower(${searchParams.q}))`),
    limit: 20,
  }) as (typeof quote.$inferSelect & { episode: typeof episode.$inferSelect })[]
  const result = data.reduce((acc: (typeof episode.$inferSelect & { quotes: typeof quote.$inferSelect[] })[], current) => {
    const episodeIndex = acc.findIndex((episode: { id: number }) => (episode.id === current.episode.id));

    if (episodeIndex === -1) {
      acc.push({
        ...current.episode,
        quotes: [current],
      });
    } else {
      acc[episodeIndex]?.quotes.push(current);
    }

    return acc;
  }, []);

  return (
    <div className="flex flex-col gap-4 p-8">
      {result.map((item) => (<ResultCard {...item} key={item.id} />))}
    </div>
  )
}
