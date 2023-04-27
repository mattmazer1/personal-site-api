import { Request, Response } from "express";
import { client } from "../db/db.js";
import { extractData, resObj } from "../utils/utils.js";

async function postUser(req: Request, res: Response) {
	const { data, ip, time, date } = extractData(req);
	console.log(data);

	const values = [ip, time, date];

	const postInfo = `INSERT INTO data(ip,time,date)
			VALUES($1, $2, $3);`;
	await client.query(postInfo, values);
	console.log("Data entry was successful!");
	res.status(200).json(resObj);
}
export { postUser };
