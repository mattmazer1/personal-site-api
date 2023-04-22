"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db/db");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const resObj = { status: "200" };
const resCheck = { action: "no action" };
let totalVisits = 0;
let storeData = null;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
app.get("/test", (res) => {
    res.send("Connected");
});
app.post("/post/active/user", async (req, res) => {
    try {
        const data = req.body.data; // need to add type
        const ip = data.ip;
        const time = data.time;
        const date = data.date;
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
        console.log(`Someone visited your site! Location:${ip} Date:${date} Time:${time} Total visits:${totalVisits}`);
        storeData = data;
        const values = [ip, time, date];
        const postInfo = `INSERT INTO data(ip,time,date) 
 		VALUES($1, $2, $3);`;
        await db_1.client.query(postInfo, values);
        db_1.client.end();
        console.log("Data entry was successful!");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
});
app.get("/get/data", async (res) => {
    try {
        const queryInfo = `
		SELECT json_build_object('items', 
        json_agg(json_build_object('data', 
        json_build_object('ip', ip, 'time', time, 'date', date)
        ))) FROM (SELECT ip, time, date
		FROM data ORDER BY id DESC) subquery;`;
        const data = await db_1.client.query(queryInfo);
        res.send(data);
        console.log(data);
        db_1.client.end();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
});
