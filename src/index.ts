import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { sigInt, sigTerm } from "./utils/utils.js";
import routes from "./routes/routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(routes);

sigTerm();
sigInt();

export const handler = serverless(app);
