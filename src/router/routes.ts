const express = require("express");
import { Request, Response } from "express";
import { postUser } from "../controller/activeUser.js";
import { limiter, validateData } from "../middleware/middleware.js";
const router = express.Router();

router.post(
	"/post/active/user",
	limiter,
	validateData,
	async (req: Request, res: Response) => {
		try {
			postUser(req, res);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			res.status(500).json({ message: err.message });
			console.log(err);
		}
	}
);

module.exports = router;
