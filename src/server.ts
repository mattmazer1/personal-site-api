import express from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import { client } from "./db/db.js";
import moment from "moment";
import "moment-timezone";

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

app.get("/test", (res: Response) => {
	res.send("Connected");
});

app.use("/post", require("./router/routes.js"));

app.post(
	"/post/active/user",
	limiter,
	validateData,
	async (req: Request, res: Response) => {
		try {
			const { data, ip, time, date } = extractData(req);
			console.log(data);

			const values = [ip, time, date];

			const postInfo = `INSERT INTO data(ip,time,date)
			VALUES($1, $2, $3);`;
			await client.query(postInfo, values);
			console.log("Data entry was successful!");
			res.status(200).json(resObj);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			res.status(500).json({ message: err.message });
			console.log(err);
		}
	}
);

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
		console.log("retrieved data", rows);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		res.status(500).json({ message: err.message });
		console.log(err);
	}
});

//chuck these into a function in utils?
// Listen for the SIGTERM signal and gracefully shut down the application
process.on("SIGTERM", async () => {
	console.log("shutting down server");
	await client.end();
	process.exit(0);
});

// Listen for the SIGINT signal and gracefully shut down the application
process.on("SIGINT", async () => {
	console.log("shutting down server");
	await client.end();
	process.exit(0);
});
