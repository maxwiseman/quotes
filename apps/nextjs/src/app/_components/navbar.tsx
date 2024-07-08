import { Card } from "@quotes/ui/card";
import { SearchBar } from "./search-bar";
import { db } from "@quotes/db";

export async function Navbar(): Promise<React.ReactElement> {
  const showData = await db.query.show.findMany()

  return (
    <Card className="rounded-none sticky top-0 flex gap-4 items-center p-4 justify-between border-0 border-b">
      <div className="text-lg font-bold">Quotes</div>
      <SearchBar shows={showData} />
      <div />
    </Card>
  )
}
