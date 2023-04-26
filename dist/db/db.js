import pg from "pg";
const { Client } = pg;
import dotenv from "dotenv";
dotenv.config();
const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : undefined,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});
client.connect((err) => {
    const customError = new Error("DB connection failed");
    if (err) {
        customError.message = err.message;
        throw customError;
    }
    else
        console.log("DB connected");
});
export { client };
