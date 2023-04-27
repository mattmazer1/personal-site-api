import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import moment from "moment";
import { extractData } from "../utils/utils.js";

// max of 1 requests every 5 minutes
const limiter = rateLimit({
	windowMs: 300000,
	max: 1,
	message: "too many requests sent, please try again 5 minutes",
	standardHeaders: true,
	legacyHeaders: false,
});

function validateIP(ip: string): boolean {
	const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
	return ipPattern.test(ip);
}

function validateData(
	req: Request,
	res: Response,
	next: NextFunction
): Response | void {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any{
	try {
		const { ip, date, time } = extractData(req);
		const validateDate = moment(date, "DD/MM/YY", true);
		const validateTime = moment(time, "HH:mm", true);

		if (!validateIP(ip)) {
			console.error(`Invalid IP address: ${ip}`);
			return res.status(400).send("Invalid IP address");
		}

		if (!validateDate.isValid() || !validateTime.isValid()) {
			console.error(`Invalid date and time: ${date} ${time}`);
			return res.status(400).send("Invalid date and time");
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		res.status(500).json({ message: err.message });
		console.log(err);
	}

	next();
}

export { limiter, validateIP, validateData };
