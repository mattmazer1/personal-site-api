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

app.post("/post/active/user", (req, res) => {
	try {
		let data = req.body.data;
		let ip = data.ip;
		let time = data.time;
		let date = data.date;

		totalVisits++;

		console.log(`Total site visits: ${totalVisits}`);

		res.send(
			`Someone visited your site! Location:${ip} Date:${date} Time:${time} Total visits:${totalVisits}`
		);

		console.log(
			`Someone visited your site! Location:${ip} Date:${date} Time:${time}`
		);
	} catch (err) {
		res.status(500).json({ message: err.message });
		console.log(err);
	}
});
