"use client"

import { quote } from "@quotes/db";
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react";
import { Quote } from "~/app/_components/quote";

export function QuoteList({ data }: {
	data: ({
		number: number | null;
		id: number;
		title: string | null;
		description: string | null;
		releaseDate: Date | null;
		seasonId: number;
		filePath: string;
	} & {
		quote: (typeof quote.$inferSelect)[];
	})
}) {
	const listRef = useRef<HTMLDivElement | null>(null)
	const quoteVirtualizer = useWindowVirtualizer({
		estimateSize: () => 100,
		count: data.quote.length,
		overscan: 5,
	})
	const items = quoteVirtualizer.getVirtualItems()
	return (
		<div ref={listRef}><div style={{ position: "relative", height: quoteVirtualizer.getTotalSize() }}>
			<div style={{
				position: "absolute",
				top: 0,
				width: "100%",
				transform: `translateY(${items[0]?.start ?? 0 - quoteVirtualizer.options.scrollMargin
					}px)`,
			}}>
				{items.map((virtualItem) => {
					const quoteData = data.quote[virtualItem.index]!;
					return (
						<Quote data-index={virtualItem.index} ref={quoteVirtualizer.measureElement} className="my-4" key={virtualItem.key} id={quoteData.id ?? 0} text={quoteData.text ?? ""} startTime={quoteData.startTime} endTime={quoteData.endTime} />
					)
				})}</div>
		</div></div >

	)
}
