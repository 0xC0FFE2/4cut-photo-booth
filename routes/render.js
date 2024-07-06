const express = require("express");
const ejs = require('ejs');
const router = express.Router();

function decodeBase64(base64Str) { // 디코딩
    return Buffer.from(base64Str, 'base64').toString('utf-8');
}

router.get("/png/:id", (req, res) => {
    if ((!req.params.id) || (!req.query.picture_id) || (!req.query.frame)) {
        return res.status(404).json(({ status: 'failed', message: 'no id' }));
    }
    const picID = decodeBase64(req.params.id);
    const frame = decodeBase64(req.query.frame);
    const selectedPic = decodeBase64(req.query.picture_id).split(',');
    res.render('.././render/4cutImage',
        {
            frame_url: frame + '.png',
            imgid1: picID + '-' + ((selectedPic[0]) - 1),
            imgid2: picID + '-' + ((selectedPic[1]) - 1),
            imgid3: picID + '-' + ((selectedPic[2]) - 1),
            imgid4: picID + '-' + ((selectedPic[3]) - 1)
        });
});

router.get("/mp4/:id", (req, res) => {
    if ((!req.params.id) || (!req.query.picture_id) || (!req.query.frame)) {
        return res.status(404).json(({ status: 'failed', message: 'no id' }));
    }
    const picID = decodeBase64(req.params.id);
    const frame = decodeBase64(req.query.frame);
    const selectedPic = decodeBase64(req.query.picture_id).split(',');
    res.render('.././render/4cutVideo',
        {
            frame_url: frame + '.png',
            imgid1: picID + '-' + ((selectedPic[0]) - 1),
            imgid2: picID + '-' + ((selectedPic[1]) - 1),
            imgid3: picID + '-' + ((selectedPic[2]) - 1),
            imgid4: picID + '-' + ((selectedPic[3]) - 1)
        });
});

module.exports = router;