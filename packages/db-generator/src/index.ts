import { promises as fs, existsSync } from "node:fs";
import Ffmpeg from "fluent-ffmpeg";
import SrtParser2 from "srt-parser-2";
import path from "node:path"
import { db, episode, quote, season } from "@quotes/db";


const basePath = "/Volumes/NVME Drive/TV Shows/Top Gear (2002 - 2015)/"
const showId = 1
const srtParser = new SrtParser2()

async function generateSrtForDir(dirPath: string): Promise<void> {
  console.log("Generating for:", dirPath)
  const dirContents = await fs.readdir(path.join(basePath, dirPath), { withFileTypes: true })
  for (const item of dirContents) {
    if (item.isDirectory()) await generateSrtForDir(path.join(dirPath, item.name))
    if (item.name.endsWith(".mkv")) {
      try { await generateSubs(path.join(basePath, dirPath, item.name)) }
      catch { console.error("Could not generate subs for:", item.name) }
    }
  }
}


async function generateSubs(filePath: string): Promise<void> {
  console.log("Generating subs for file:", filePath)
  if (existsSync(filePath.replace(".mkv", ".srt"))) fs.unlink(filePath.replace(".mkv", ".srt"))
  return new Promise((resolve, reject) => {
    Ffmpeg().input(filePath).output(filePath.replace(".mkv", ".srt")).on('end', () => resolve()).on("error", (error) => reject(error)).run()
  })
}

async function insertSubsForDir(dirPath: string, seasonId: number): Promise<void> {
  const dirContents = await fs.readdir(path.join(basePath, dirPath), { withFileTypes: true })
  for (const item of dirContents) {


    if (item.isDirectory()) {
      console.log(`Inserting season ${item.name}...`)
      const data = { showId, title: item.name, number: /Season [0-9]/.test(item.name) ? parseInt(/Season [0-9]+(?= )/.exec(item.name)?.toString().replace("Season ", "") ?? "") : undefined }
      const inserted = await db.insert(season).values(data).returning({ insertedId: season.id })
      if (typeof inserted[0]?.insertedId === 'number')
        await insertSubsForDir(path.join(dirPath, item.name), inserted[0].insertedId)
      else console.error("Didn't get ID back from database...")
    }


    if (item.name.endsWith(".srt") && !item.name.startsWith("._")) {
      const srtContents = await fs.readFile(path.join(basePath, dirPath, item.name))
      const srtData = srtParser.fromSrt(srtContents.toString())
      console.log(`Inserting episode ${item.name}...`)

      const data = { title: item.name.includes("Top Gear - ") ? undefined : item.name.replace(".srt", ""), number: /S[0-9]{2}E[0-9]{2}/.test(item.name) ? parseInt(/E[0-9]{2}/.exec(item.name)?.toString().replace("E", "") ?? "") : undefined, filePath: path.join(dirPath, item.name.replace(".srt", ".mkv")), seasonId }

      const inserted = await db.insert(episode).values(data).returning({ insertedId: episode.id })

      if (srtData.length <= 1) { console.error(`Could not parse ${item.name}:`, srtData) }

      if (typeof inserted[0]?.insertedId === "number") {
        console.log("Inserting quotes")
        await db.insert(quote).values(srtData.map((quoteItem) => ({
          text: quoteItem.text.replace(/[\u{0080}-\u{10FFFF}]/gu, ""),
          index: parseInt(quoteItem.id) - 1,
          startTime: quoteItem.startSeconds,
          endTime: quoteItem.endSeconds,
          episodeId: inserted[0]?.insertedId ?? 0
        })))
      }
      else console.error(`Didn't get ID back from database for episode ${item.name}...`)
    }
  }
}

await insertSubsForDir("", 0)
// await generateSrtForDir("")
