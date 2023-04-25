import express from "express";
import cors from "cors";
import { client } from "./db/db.js";
import rateLimit from "express-rate-limit";
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
const resObj = { status: "200" };
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
app.get("/test", (res) => {
    res.send("Connected");
});
// add this to utils
// max of 2 requests per minute
const limiter = rateLimit({
    windowMs: 1200,
    max: 2,
    message: "too many requests sent, please try again 2 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});
app.post("/post/active/user", limiter, async (req, res) => {
    try {
        const data = req.body.data;
        const ip = data.ip;
        const time = data.time;
        const date = data.date;
        console.log(data);
        const values = [ip, time, date];
        const postInfo = `INSERT INTO data(ip,time,date) 
 		VALUES($1, $2, $3);`;
        await client.query(postInfo, values);
        console.log("Data entry was successful!");
        res.status(200).json(resObj);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
});
app.get("/get/data", async (_req, res) => {
    try {
        const queryInfo = `
		SELECT json_build_object('items', 
        json_agg(json_build_object('data', 
        json_build_object('ip', ip, 'time', time, 'date', date)
        ))) FROM (SELECT ip, time, date
		FROM data ORDER BY id DESC) subquery;`;
        const { rows } = await client.query(queryInfo);
        res.status(200).json(resObj);
        console.log(rows[0].json_build_object.items);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
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
