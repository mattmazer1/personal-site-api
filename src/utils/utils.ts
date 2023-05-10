import { Request } from "express";
import { client } from "../db/db.js";

const resObj: { status: string } = { status: "200" };

function extractData(req: Request): {
	data: undefined;
	ip: string;
	date: string;
	time: string;
} {
	const data = req.body.data;
	const ip: string = data.ip;
	const time: string = data.time;
	const date: string = data.date;
	return { data, ip, date, time };
}

// Listen for the SIGTERM signal and gracefully shut down the application
function sigTerm(): void {
	process.on("SIGTERM", async () => {
		console.log("shutting down server");
		await client.end();
		process.exit(0);
	});
}

// Listen for the SIGINT signal and gracefully shut down the application
function sigInt(): void {
	process.on("SIGINT", async () => {
		console.log("shutting down server");
		await client.end();
		process.exit(0);
	});
}

export { extractData, resObj, sigTerm, sigInt };
