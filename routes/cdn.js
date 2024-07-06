const express = require('express');
const path = require('path');
const fs = require("fs");
const router = express.Router();

router.get("/image/:id", (req, res) => {
    const imgid = req.params.id;
    if (/[\!@#\$%\^&\*]/.test(imgid)) {  //간단한 보안 테스트
        return res.status(404).json({ error: "not vaild request" });
    } else if ((0 < imgid.slice(0,4)) && (100000 > imgid.slice(0,4))) {
        imageFileName = "image-"+imgid+"-img.png";
        const imagePath = path.join(__dirname, '.././uploads', imageFileName);
        // 파일 존재 여부 확인 후 응답
        fs.access(imagePath, fs.constants.F_OK, (err) => {
            if (err) {
                // 파일이 존재하지 않을 경우 404 응답
                res.status(204).json({ error: "file not found", id: imgid });
            } else {
                // 파일이 존재할 경우 해당 파일을 읽어서 전송
                res.sendFile(imagePath);
            }
        });
    } else {
        return res.status(404).json({ error: "data not found" });
    }
});

router.get("/video/:id", (req, res) => {
    const imgid = req.params.id;
    if (/[\!@#\$%\^&\*]/.test(imgid)) {
        return res.status(404).json({ error: "not vaild request" });
    } else if ((0 < imgid.slice(0,4)) && (100000 > imgid.slice(0,4))) {
        imageFileName = "video-" + imgid + "-vid.mp4";
        const imagePath = path.join(__dirname, '.././uploads', imageFileName);
        // 파일 존재 여부 확인 후 응답
        fs.access(imagePath, fs.constants.F_OK, (err) => {
            if (err) {
                // 파일이 존재하지 않을 경우 404 응답
                res.status(204).json({ error: "file not found", id: imgid });
            } else {
                // 파일이 존재할 경우 해당 파일을 읽어서 전송
                res.sendFile(imagePath);
            }
        });
    } else {
        return res.status(404).json({ error: "data not found" });
    }
});

module.exports = router;