import { Card, CardContent, CardFooter } from "@quotes/ui/card";

export function Quote(quoteData: { id: number, scrollTo?: boolean, text: string, startTime: number, endTime: number, character?: string }): React.ReactElement {
  const startDate = new Date(quoteData.startTime * 1000)
  const endDate = new Date(quoteData.endTime * 1000)

  return (
    <Card className="overflow-hidden">
      <CardContent className="pb-2 p-4 border-b shadow dark:bg-muted/50">
        <span className="text-muted-foreground">{quoteData.character ? `${quoteData.character}: ` : undefined}</span>{quoteData.text}
      </CardContent>
      <CardFooter className="pt-1 p-4 text-muted-foreground bg-muted/50 dark:bg-card text-sm py-2">
        {`${startDate.getUTCHours().toString().padStart(2, "0")}:${startDate.getUTCMinutes().toString().padStart(2, "0")}:${startDate.getUTCSeconds().toString().padStart(2, "0")} - ${endDate.getUTCHours().toString().padStart(2, "0")}:${endDate.getUTCMinutes().toString().padStart(2, "0")}:${endDate.getUTCSeconds().toString().padStart(2, "0")}`}
      </CardFooter>
    </Card>
  )
}
