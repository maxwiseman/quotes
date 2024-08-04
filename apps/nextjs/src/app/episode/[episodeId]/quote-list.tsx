"use client"

import type { quote } from "@quotes/db";
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { useEffect, useRef } from "react";
import { Quote } from "~/app/_components/quote";

export function QuoteList({ data, scrollIndex }: {
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
	scrollIndex?: number
}): React.ReactElement {
	const listRef = useRef<HTMLDivElement | null>(null)
	const quoteVirtualizer = useWindowVirtualizer({
		estimateSize: () => 100,
		count: data.quote.length,
		overscan: 5,
		scrollMargin: listRef.current?.offsetTop ?? 0
	})
	useEffect(() => {
		if (scrollIndex)
			quoteVirtualizer.scrollToIndex(scrollIndex)
	}, [scrollIndex])
	const items = quoteVirtualizer.getVirtualItems()
	return (
		<div ref={listRef}><div style={{ position: "relative", height: quoteVirtualizer.getTotalSize() }}>
			<div style={{
				position: "absolute",
				top: 0,
				width: "100%",
				transform: `translateY(${((items[0]?.start ?? 0) - quoteVirtualizer.options.scrollMargin).toString()
					}px)`,
			}}>
				{items.map((virtualItem) => {
					const quoteData = data.quote[virtualItem.index]!;
					return (
						<Quote data-index={virtualItem.index} ref={quoteVirtualizer.measureElement} className="mb-4" key={virtualItem.key} id={quoteData.id} text={quoteData.text} character={quoteData.character ?? undefined} startTime={quoteData.startTime} endTime={quoteData.endTime} />
					)
				})}</div>
		</div></div >

	)
}
