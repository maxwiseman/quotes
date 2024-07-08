import { promises as fs } from "node:fs";
import Ffmpeg from "fluent-ffmpeg";
import SrtParser2 from "srt-parser-2";
import path from "node:path"
import { db, episode, quote, season } from "@quotes/db";


const basePath = "/Users/maxwiseman/Downloads/Top Gear"
const showId = 1
const srtParser = new SrtParser2()

async function generateSrtForDir(dirPath: string): Promise<void> {
  const dirContents = await fs.readdir(path.join(basePath, dirPath), { withFileTypes: true })
  for (const item of dirContents) {
    if (item.isDirectory()) await generateSrtForDir(path.join(basePath, dirPath, item.name))
    if (item.name.endsWith(".mkv")) {
      generateSubs(path.join(dirPath, item.name))
    }
  }
}

function generateSubs(filePath: string): void {
  Ffmpeg().input(filePath).output(filePath.replace(".mkv", ".srt")).run()
}

async function insertSubsForDir(dirPath: string, seasonId: number): Promise<void> {
  const dirContents = await fs.readdir(path.join(basePath, dirPath), { withFileTypes: true })
  for (const item of dirContents) {


    if (item.isDirectory()) {
      console.log(`Inserting season ${item.name}...`)
      const data = { showId, title: item.name, number: parseInt(/Season [0-9]+(?= )/.exec(item.name)?.toString().replace("Season ", "") ?? "") }
      const inserted = await db.insert(season).values(data).returning({ insertedId: season.id }).onConflictDoUpdate({ target: season.id, set: data })
      if (typeof inserted[0]?.insertedId === 'number')
        await insertSubsForDir(path.join(dirPath, item.name), inserted[0].insertedId)
      else console.error("Didn't get ID back from database...")
    }


    if (item.name.endsWith(".srt")) {
      const srtContents = await fs.readFile(path.join(basePath, dirPath, item.name))
      const srtData = srtParser.fromSrt(srtContents.toString())
      console.log(`Inserting episode ${item.name}...`)

      const data = { title: item.name.includes("Top Gear - ") ? undefined : item.name.replace(".srt", ""), number: /S[0-9]{2}E[0-9]{2}/.test(item.name) ? parseInt(/E[0-9]{2}/.exec(item.name)?.toString().replace("E", "") ?? "") : undefined, filePath: path.join(dirPath, item.name.replace(".srt", ".mkv")), seasonId }

      const inserted = await db.insert(episode).values(data).returning({ insertedId: episode.id }).onConflictDoUpdate({ target: episode.id, set: data })

      if (typeof inserted[0]?.insertedId === "number")
        await db.insert(quote).values(srtData.map((quoteItem) => ({
          text: quoteItem.text.replace(/[\u{0080}-\u{10FFFF}]/gu, ""),
          index: parseInt(quoteItem.id) - 1,
          startTime: quoteItem.startSeconds,
          endTime: quoteItem.endSeconds,
          episodeId: inserted[0]?.insertedId ?? 0
        })))
      else console.error(`Didn't get ID back from database for episode ${item.name}...`)
    }
  }
}

await insertSubsForDir("", 0)
