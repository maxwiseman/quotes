import { db, episode, eq } from "@quotes/db"
import type { quote } from "@quotes/db";
import { Separator } from "@quotes/ui/separator"
import { notFound } from "next/navigation"
import { Quote } from "~/app/_components/quote"
import { QuoteList } from "./quote-list";

export default async function Page({ params, searchParams }: { params: { episodeId: string }, searchParams: { qId?: string } }): Promise<React.ReactElement> {
	const data = await db.query.episode.findFirst({
		where: eq(episode.id, parseInt(params.episodeId)),
		with: {
			quote: true
		}
	}) as typeof episode.$inferSelect & { quote: typeof quote.$inferSelect[] } | undefined
	if (data === undefined) notFound()

	return (
		<div className="flex items-center flex-col p-8">
			<div className="flex flex-col gap-4 max-w-[50rem] w-full">
				<div className="flex flex-col gap-2">
					<h1 className="text-4xl font-bold">{data.title ? data.title : `Episode ${data.number?.toString() ?? ""}`}</h1>
					<h2>{data.description}</h2>
				</div>
				<Separator className="mb-4" />
				<QuoteList data={data} />

			</div>
		</div>
	)
}
