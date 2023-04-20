"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
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
app.post("/get/active/user", (req, res) => {
    //change post to get?
    try {
        const data = req.body.data; // need to add type
        const ip = data.ip;
        const time = data.time;
        const date = data.date;
        console.log(data);
        console.log(storeData);
        if (JSON.stringify(data) === JSON.stringify(storeData)) {
            res.json(resCheck);
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
        console.log(`Someone visited your site! Location:${ip} Date:${date} Time:${time} Total visits:${totalVisits}`);
        storeData = data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
});
