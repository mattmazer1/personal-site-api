// require("dotenv").config();
import express from "express";
import { Request, Response } from "express";
import cors from "cors";

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

app.post("/get/active/user", (req: Request, res: Response) => {
	//change post to get?
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

		res.status(200).json(resObj);
		// res.json(resObj);
		// res.send(
		// 	`Someone visited your site! Location:${ip} Date:${date} Time:${time} Total visits:${totalVisits}`
		// );

		console.log(
			`Someone visited your site! Location:${ip} Date:${date} Time:${time} Total visits:${totalVisits}`
		);
		storeData = data;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		res.status(500).json({ message: err.message });
		console.log(err);
	}
});

app.get("/get/data", async (req: Request, res: Response) => {
	try {
		const queryInfo = ``;
		const { rows } = await client.query(queryInfo);
		res.send(rows);
		console.log(rows);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		res.status(500).json({ message: err.message });
		console.log(err);
	}
});

/*
SELECT JSON_OBJECT('items', 
       JSON_ARRAYAGG(JSON_OBJECT('data', 
           JSON_OBJECT('ip', ip, 'time', time, 'date', date)
       ))) 
FROM your_table;
*/
