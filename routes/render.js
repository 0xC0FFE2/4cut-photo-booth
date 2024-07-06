const express = require("express");
const ejs = require('ejs');
const router = express.Router();


router.get("/png/:id", (req, res) => {
    if (!req.params.id) {
        return res.status(404).json(({ status: 'failed', message: 'no id' }));
    }
    res.render('.././render/4cutImage', 
        {
            frame_url: 'love.png',
            imgid:'84725-3'
        });
});

router.get("/mp4/:id", (req, res) => {
    if (!req.params.id) {
        return res.status(404).json(({ status: 'failed', message: 'no id' }));
    }
    res.render('.././render/4cutVideo', 
        {
            frame_url: 'love.png',
            imgid:'84725-3'
        });
});

module.exports = router;