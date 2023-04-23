import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
	host: process.env.PGHOST,
	port: process.env.PGPORT ? parseInt(process.env.PGPORT) : undefined,
	database: process.env.PGDATABASE,
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD,
});

client.connect((err) => {
	const customError = new Error("DB connection failed");
	if (err) {
		customError.message = err.message;
		throw customError;
	} else console.log("DB connected");
});

export { client };
