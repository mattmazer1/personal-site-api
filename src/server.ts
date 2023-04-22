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
interface ResObj {
	status: string;
}
interface ResCheck {
	action: string;
}

const resObj: ResObj = { status: "200" };
const resCheck: ResCheck = { action: "no action" };

let totalVisits = 0;
let storeData: UserData | null = null;

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

app.get("/test", (res: Response) => {
	res.send("Connected");
});

app.post("/post/active/user", async (req: Request, res: Response) => {
	try {
		const data = req.body.data; // need to add type
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

		totalVisits++;

		console.log(`Total site visits: ${totalVisits}`);

		res.status(200).json(resObj); //move this to after query?
		// res.json(resObj);
		// res.send(
		// 	`Someone visited your site! Location:${ip} Date:${date} Time:${time} Total visits:${totalVisits}`
		// );

		console.log(
			`Someone visited your site! Location:${ip} Date:${date} Time:${time} Total visits:${totalVisits}`
		);
		storeData = data;

		const values = [ip, time, date];
		const postInfo = `INSERT INTO data(ip,time,date) 
 		VALUES($1, $2, $3);`;

		await client.query(postInfo, values);
		client.end();
		console.log("Data entry was successful!");

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		res.status(500).json({ message: err.message });
		console.log(err);
	}
});

app.get("/get/data", async (res: Response) => {
	try {
		const queryInfo = `
		SELECT json_build_object('items', 
        json_agg(json_build_object('data', 
        json_build_object('ip', ip, 'time', time, 'date', date)
        ))) FROM (SELECT ip, time, date
		FROM data ORDER BY id DESC) subquery;`;

		const data = await client.query(queryInfo);
		res.send(data);
		console.log(data);
		client.end();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		res.status(500).json({ message: err.message });
		console.log(err);
	}
});
