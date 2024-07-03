const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors');
app.use(cors());

const uploadRouter = require("./routes/upload");
const { timeStamp } = require("console");

app.use(express.static(path.join(__dirname, '/static')));

app.get("/hello", (req, res) => {
    return res.status(400).send("Unknown");
});

app.get("/gateway", (req, res) => {
    return res.json({ping:Date.now()});
});

app.use("/gateway/video",uploadRouter);

app.listen(8080, () => {
    console.log("[INFO] Express Start");
});
