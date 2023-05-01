import { client } from "../db/db.js";
import { extractData, resObj } from "../utils/utils.js";
async function postUser(req, res) {
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
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
}
export { postUser };
