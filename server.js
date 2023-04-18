// require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

let totalVisits = 0;

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

app.get("/test", (req, res) => {
	res.send("Connected");
});

app.get("/active/user", (req, res) => {
	try {
		totalVisits++;
		console.log(totalVisits);

		res.send(`Someone visited your site! Location:${req.ip} Time:${req.time}`);

		res.send(`Total site visits: ${totalVisits}`);
	} catch (err) {
		console.log(err);
	}
});
