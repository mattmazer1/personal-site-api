import pg from "pg";
const { Client } = pg;
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.CONNECTION_URL;

const client = new Client({
	connectionString,
});
client.connect((err) => {
	const customError = new Error("DB connection failed");
	if (err) {
		customError.message = err.message;
		throw customError;
	} else console.log("DB connected");
});

export { client };
