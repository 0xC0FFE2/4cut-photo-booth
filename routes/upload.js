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
        console.log(`[STORAGE] video-${req.cookies.PicID}-${file.originalname} is Uploaded`);
        cb(null, `video-${req.cookies.PicID}-${file.originalname}`);
    }
});

const image = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        console.log(`[STORAGE] image-${req.cookies.PicID}-${file.originalname} is Uploaded`);
        cb(null, `image-${req.cookies.PicID}-${file.originalname}`);
    }
});

const shotUpload = multer({storage: image});
const upload = multer({ storage: storage });

//File Upload 받기
router.post("/upload",upload.single('video'),(req,res) => {
    if(!req.file) {
        console.log("[ERR] Upload err. no data.");
        return res.status(404).json(({status:'failed',message:'no data uploaded'}));
    }
    console.log("[INFO] Uploaded Successfully");
    return res.status(200).json(({status:'ok',message:'data uploaded'}));
});

//File Upload 받기
router.post("/image",shotUpload.single('image'),(req,res) => {
    if(!req.file) {
        console.log("[ERR] Upload err. no data.");
        return res.status(404).json(({status:'failed',message:'no data uploaded'}));
    }
    console.log("[INFO] Uploaded Successfully");
    return res.status(200).json(({status:'ok',message:'data uploaded'}));
});

module.exports = router;