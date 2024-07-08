import { db, eq, quote } from "@quotes/db"

export default eventHandler(async (event) => {
	if (typeof event.context.params?.qId !== "number") return "Please provide a quote id!"
	console.log("Getting id:", event.context.params.qId)
	const data = await db.query.quote.findFirst({ where: eq(quote.id, event.context.params.qId) })
	console.log(data)
	return "Start by editing <code>server/routes/index.ts</code>.";
});
