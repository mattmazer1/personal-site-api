// require("dotenv").config();
import express from "express";
import { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

let totalVisits = 0;

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

app.get("/test", (res: Response) => {
	res.send("Connected");
});

app.post("/post/active/user", (req: Request, res: Response) => {
	try {
		const data = req.body.data; // need to add type
		const ip: string = data.ip;
		const time: string = data.time;
		const date: string = data.date;

		totalVisits++;

		console.log(`Total site visits: ${totalVisits}`);

		res.send(
			`Someone visited your site! Location:${ip} Date:${date} Time:${time} Total visits:${totalVisits}`
		);

		console.log(
			`Someone visited your site! Location:${ip} Date:${date} Time:${time}`
		);
	} catch (err: any) {
		res.status(500).json({ message: err.message });
		console.log(err);
	}
});
