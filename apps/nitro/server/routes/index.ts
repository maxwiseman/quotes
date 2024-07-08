import { db, eq, quote } from "@quotes/db"

export default eventHandler(async (event) => {
  const data = await db.query.quote.findFirst({ where: eq(quote.id, 1) })
  return "Start by editing <code>server/routes/index.ts</code>.";
});
