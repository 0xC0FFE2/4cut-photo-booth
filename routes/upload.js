const express = require("express");
const router = express.Router();

router.get("/upload",(req,res) => {
    res.send("This is Upload Router")
});

module.exports = router;