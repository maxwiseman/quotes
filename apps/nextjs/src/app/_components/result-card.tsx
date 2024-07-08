import { Button } from "@quotes/ui/button";
import { Card, CardContent, CardHeader } from "@quotes/ui/card";
import { Separator } from "@quotes/ui/separator";
import { IconPlayerPlay, IconShare2 } from "@tabler/icons-react";
import { Quote } from "./quote";
import Link from "next/link";

export function ResultCard(resultData: { title: string | null, description: string | null, number: number | null, id: number, quotes: { text: string, startTime: number, endTime: number, id: number }[] }): React.ReactElement {
  return (
    <Link href={`/episode/${resultData.id.toString()}`}>
      <Card>
        <CardHeader className="p-4">
          <div className="flex gap-10 justify-between items-center flex-row">
            <div className="flex flex-col">
              <h4 className="font-bold text-lg">{resultData.title ? resultData.title : `Episode ${resultData.number?.toString() ?? "Unknown"}`}</h4>
              <h5 className="text-muted-foreground">{resultData.description}</h5>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" icon={<IconShare2 />} />
              <Button icon={<IconPlayerPlay />}>Watch</Button>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex gap-4 flex-col p-4">
          {resultData.quotes.map((quote) => <Quote key={quote.id} text={quote.text} startTime={quote.startTime} endTime={quote.endTime} id={quote.id} />)}
        </CardContent>
      </Card>
    </Link>
  )
}
