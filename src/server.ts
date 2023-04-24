import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import { client } from "./db/db";

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

interface UserData {
	ip: string;
	time: string;
	date: string;
}
const resObj: { status: string } = { status: "200" };
const resCheck: { action: string } = { action: "no action" };

let storeData: UserData | null = null;

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

app.get("/test", (res: Response) => {
	res.send("Connected");
});

app.post("/post/active/user", async (req: Request, res: Response) => {
	try {
		const data = req.body.data; // need to add type and make object?
		const ip: string = data.ip;
		const time: string = data.time;
		const date: string = data.date;

		console.log(data);
		console.log(storeData);

		if (JSON.stringify(data) === JSON.stringify(storeData)) {
			res.status(200).json(resCheck);
			console.log("Already visited");
			return;
		}

		res.status(200).json(resObj); //move this to after query?
		// res.json(resObj);
		// res.send(
		// 	`Someone visited your site! Location:${ip} Date:${date} Time:${time} Total visits:${totalVisits}`
		// );

		console.log(
			`Someone visited your site! Location:${ip} Date:${date} Time:${time}`
		);
		storeData = data;

		const values = [ip, time, date];
		const postInfo = `INSERT INTO data(ip,time,date) 
 		VALUES($1, $2, $3);`;

		await client.query(postInfo, values);
		console.log("Data entry was successful!");

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		res.status(500).json({ message: err.message });
		console.log(err);
	}
});

app.get("/get/data", async (_req: Request, res: Response) => {
	try {
		const queryInfo = `
		SELECT json_build_object('items', 
        json_agg(json_build_object('data', 
        json_build_object('ip', ip, 'time', time, 'date', date)
        ))) FROM (SELECT ip, time, date
		FROM data ORDER BY id DESC) subquery;`;

		const { rows } = await client.query(queryInfo);
		res.send(rows[0].json_build_object);
		console.log(rows[0].json_build_object.items);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		res.status(500).json({ message: err.message });
		console.log(err);
	}
});

//chuck these into a function in utils?
// Listen for the SIGTERM signal and gracefully shut down the application
process.on("SIGTERM", async () => {
	console.log("Shutting down server");
	await client.end();
	process.exit(0);
});

// Listen for the SIGINT signal and gracefully shut down the application
process.on("SIGINT", async () => {
	console.log("Shutting down server");
	await client.end();
	process.exit(0);
});
