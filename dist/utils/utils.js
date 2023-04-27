import { client } from "../db/db.js";
const resObj = { status: "200" };
function extractData(req) {
    const data = req.body.data;
    const ip = data.ip;
    const time = data.time;
    const date = data.date;
    return { data, ip, date, time };
}
// Listen for the SIGTERM signal and gracefully shut down the application
function sigTerm() {
    process.on("SIGTERM", async () => {
        console.log("shutting down server");
        await client.end();
        process.exit(0);
    });
}
// Listen for the SIGINT signal and gracefully shut down the application
function sigInt() {
    process.on("SIGINT", async () => {
        console.log("shutting down server");
        await client.end();
        process.exit(0);
    });
}
export { extractData, resObj, sigTerm, sigInt };
