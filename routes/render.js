const express = require("express");
const ejs = require('ejs');
const router = express.Router();

//File Upload 받기
router.get("/:id", (req, res) => {
    if (!req.params.id) {
        return res.status(404).json(({ status: 'failed', message: 'no id' }));
    }
    res.render('.././render/4cut', 
        {
            frame_url: '/assets/frames/dsm.png'

        });
});


module.exports = router;