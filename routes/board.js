const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const connAwsS3 = require('../model/conn-aws-S3');
const connAwsRDS = require('../model/conn-aws-RDS');
const router = express.Router();
const imageStorage = multer.memoryStorage();
const upload = multer({storage: imageStorage});

router.get('/', async (req, res) => {
    let rsp = await connAwsRDS.getMessagesFromDB();
    res.status(rsp.statusCode).json(rsp.data);
})

router.post('/', upload.single('messageImage'), async (req, res) => {
    const message = req.body.messageText;
    let imageFilename = null;
    let result;

    if(req.file) {
        const fileMimeType = req.file.mimetype;

        if(fileMimeType === 'image/jpeg' || fileMimeType === 'image/png') {
            let imageResized = req.file.buffer;
            const image = sharp(imageResized);
            const imageMetadata = await image.metadata();

            if(imageMetadata.height > 200) {
                imageResized = await image.resize({ height: 200, fit: 'contain' }).toBuffer();
            }
            imageFilename = `${Date.now()}-${req.file.originalname}`;
    
            result = await connAwsS3.uploadToS3(imageResized, imageFilename, fileMimeType);
            if(!result.ok) {
                res.status(500).send({"error": true});
                return;
            }
        }
        else {
            res.status(400).json({"message": "請上傳圖片檔(.png / .jpeg)"});
            return;
        }
    }

    result = await connAwsRDS.addMessagesToDB(message, imageFilename);
    res.status(result.statusCode).send(result.data);
})

module.exports = router