const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors');
app.use(cors());

app.set('view engine', 'ejs');

const uploadRouter = require("./routes/upload");
const cdnRouter = require("./routes/cdn");
const renderRouter = require("./routes/render");
const saveRouter = require("./routes/save");

app.use(express.static(path.join(__dirname, '/static'))); //정적 파일 서브

app.get("/gateway", (req, res) => { // 게이트웨이 test
    console.log("[INFO] Gateway Pinged");
    return res.json({ping:Date.now()});
});

app.use("/gateway/media",uploadRouter);
app.use("/gateway/cdn",cdnRouter);
app.use("/render",renderRouter);
app.use("/download",saveRouter);

app.listen(8080, () => {
    console.log("[INFO] Express Start");
});
