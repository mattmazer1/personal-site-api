import express from "express";
import cors from "cors";
import { client } from "./db/db.js";
// import rateLimit from "express-rate-limit";
import moment from "moment";
import "moment-timezone";
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
// add this to middleware
// max of 2 requests per minute
// const limiter = rateLimit({
// 	windowMs: 120000, // change to every 5 minutes?
// 	max: 1,
// 	message: "too many requests sent, please try again 2 minutes",
// 	standardHeaders: true,
// 	legacyHeaders: false,
// });
// add this to middleware
function validateIP(ip) {
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipPattern.test(ip);
}
function validateData(req, res, next) {
    const data = req.body.data;
    const ip = data.ip;
    const time = data.time;
    const date = data.date;
    if (!validateIP(ip)) {
        console.error(`Invalid IP address: ${ip}`);
        return res.status(400).send("Invalid IP address");
    }
    // const dateTimeString = `${date} ${time}`;
    // const dateTime = moment(dateTimeString, "DD/MM/YY HH:mm");
    const validateDate = moment(date, "D/M/YY");
    const validateTime = moment(time, "HH:mm");
    if (!validateDate.isValid() && !validateTime.isValid()) {
        console.error(`Invalid date and time: ${date} ${time}`);
        return res.status(400).send("Invalid date and time");
    }
    console.log(`IP: ${ip}, Date: ${date}, Time: ${time}`);
    next();
}
// module.exports = validateData;
app.post("/post/active/user", validateData, async (req, res) => {
    try {
        const data = req.body.data;
        const ip = data.ip;
        const time = data.time;
        const date = data.date;
        // console.log(data)
        console.log(data, ip, time, date);
        // 	const values = [ip, time, date];
        // 	const postInfo = `INSERT INTO data(ip,time,date)
        // VALUES($1, $2, $3);`;
        // 	await client.query(postInfo, values);
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
        res.send(rows[0].json_build_object);
        console.log("retrieved data", rows);
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
