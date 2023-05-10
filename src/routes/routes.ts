import express from "express";
import { postUser } from "../controller/activeUser.js";
import { fetchData } from "../controller/getData.js";
import { limiter, validateData } from "../middleware/middleware.js";
const router = express.Router();

router.post("/post/active/user", limiter, validateData, postUser);

router.get("/get/data", fetchData);

export default router;
