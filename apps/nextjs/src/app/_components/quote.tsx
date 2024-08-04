import { cn } from "@quotes/ui";
import { LinkButton } from "@quotes/ui/button";
import { Card, CardContent, CardFooter } from "@quotes/ui/card";
import { IconPlayerPlay } from "@tabler/icons-react";
import type { HTMLProps } from "react";

export function Quote({ withPlayButton = true, ...quoteData }: Omit<HTMLProps<HTMLDivElement>, "id"> & { id: number, text: string, startTime: number, endTime: number, character?: string } & { withPlayButton?: boolean }): React.ReactElement {
  const startDate = new Date(quoteData.startTime * 1000)
  const endDate = new Date(quoteData.endTime * 1000)

  return (
    <Card {...quoteData} id={quoteData.id.toString()} className={cn("overflow-hidden", quoteData.className)}>
      <CardContent className="pb-2 p-4 border-b shadow dark:bg-muted/50">
        <span className="text-muted-foreground">{quoteData.character ? `${quoteData.character}: ` : undefined}</span>{quoteData.text}
      </CardContent>
      <CardFooter className="pt-1 p-4 text-muted-foreground bg-muted/50 dark:bg-card text-sm py-2 flex items-center gap-2">
        {`${startDate.getUTCHours().toString().padStart(2, "0")}:${startDate.getUTCMinutes().toString().padStart(2, "0")}:${startDate.getUTCSeconds().toString().padStart(2, "0")} - ${endDate.getUTCHours().toString().padStart(2, "0")}:${endDate.getUTCMinutes().toString().padStart(2, "0")}:${endDate.getUTCSeconds().toString().padStart(2, "0")}`}
        {withPlayButton ? <LinkButton size="icon" variant="ghost" href={`/dynamic-video/${quoteData.id.toString()}`} className="p-1 w-6 h-6">
          <IconPlayerPlay className="w-4 h-4" />
        </LinkButton> : null}
      </CardFooter>
    </Card>
  )
}
