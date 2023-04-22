import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
	host: process.env.HOST,
	port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
	database: process.env.DATABASE,
	user: process.env.USER,
	password: process.env.PASSWORD,
});

client.connect((err) => {
	const customError = new Error("DB connection failed");
	if (err) throw customError;
	else console.log("DB connected");
});

export { client };
