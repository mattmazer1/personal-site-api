import express from "express";
import cors from "cors";
import { sigInt, sigTerm } from "./utils/utils.js";
import routes from "./routes/routes.js";

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

app.use(routes);

sigTerm();
sigInt();
