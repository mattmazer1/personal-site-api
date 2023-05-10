import { Request, Response } from "express";
import { client } from "../db/db.js";

async function fetchData(_req: Request, res: Response): Promise<void> {
	try {
		const queryInfo = `
SELECT json_build_object('items', 
json_agg(json_build_object('data', 
json_build_object('ip', ip, 'time', time, 'date', date)
))) FROM (SELECT ip, time, date
FROM data ORDER BY id DESC) subquery;`;

		const { rows } = await client.query(queryInfo);
		res.status(200).send(rows[0].json_build_object);
		console.log("retrieved data", rows);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		res.status(500).json({ message: err.message });
		console.log(err);
	}
}

export { fetchData };
