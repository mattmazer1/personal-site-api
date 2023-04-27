import { Request } from "express";

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

export { extractData, resObj };
