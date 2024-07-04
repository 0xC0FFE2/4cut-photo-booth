const express = require('express');
const fs = require("fs");
const router = express.Router();

router.get("/:image", (req, res) => {
    const imgid = req.params.image;
    if ((isNaN(imgid))) {
        return res.status(404).json({ error: "not a number" });
    } else if ((0 < imgid) && (100000 > imgid)) {
        const imagePath = path.join(__dirname, 'uploads', imageFileName);

        // 파일 존재 여부 확인 후 응답
        fs.access(imagePath, fs.constants.F_OK, (err) => {
            if (err) {
                // 파일이 존재하지 않을 경우 404 응답
                res.status(404).send('File not found!');
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