import { promises as fs } from "node:fs";
import Ffmpeg from "fluent-ffmpeg";
import SrtParser2 from "srt-parser-2";

import { db } from "@quotes/db";

const parser = new SrtParser2();
Ffmpeg()
  .input("/Users/maxwiseman/Downloads/India Special 2011.mkv")
  .output("./subs.srt")
  .run();

const rawSrtData = await fs.readFile("./subs.srt");
const srtData = parser.fromSrt(rawSrtData.toString());
