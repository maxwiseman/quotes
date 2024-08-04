import { db, eq, quote } from "@quotes/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "./env";

export async function middleware(request: NextRequest) {
  const quoteData = await db.query.quote.findFirst({ where: eq(quote.id, parseInt(request.nextUrl.pathname.replace("/dynamic-video/", ""))), with: { episode: true } }).execute()
  if (!quoteData) return NextResponse.error()
  return NextResponse.rewrite(new URL(`/quote/${quoteData.episode.filePath}?secret=${env.AUTH_SECRET}&qId=${quoteData.id}&qIdx=${quoteData.index}`, 'http://localhost:8080'))
}

export const config = {
  matcher: '/dynamic-video/:path*'
}
