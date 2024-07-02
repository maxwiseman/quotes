import { Button } from "@quotes/ui/button";
import srtParser2 from "srt-parser-2"
import { promises as fs } from "fs"

export default async function HomePage(): Promise<React.ReactElement> {
  const srtFile = await fs.readFile("~/Projects/quotes/apps/backend/subs.srt")
  const parser = new srtParser2()
  const srtData = parser.fromSrt(srtFile.toString())

  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1>Heading one</h1>
        <h2>Heading two</h2>
        <Button>{srtData[0]?.text}</Button>
      </div>
    </main>
  );
}
