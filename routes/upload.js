const express = require("express");
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const cookieParser = require("cookie-parser");

router.use(cookieParser());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `video-${req.cookies.PicID}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

router.post("/upload",upload.single('video'),(req,res) => {
    if(!req.file) {
        return res.status(404).json(({status:'failed',message:'no data uploaded'}));
    }
    return res.status(200).json(({status:'ok',message:'data uploaded'}));
});



module.exports = router;