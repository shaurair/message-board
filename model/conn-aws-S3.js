require('dotenv').config();
const {S3Client, PutObjectCommand} = require("@aws-sdk/client-s3")
const myBucket = process.env.S3_BUCKET;

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    region: process.env.S3_REGION
});

async function uploadToS3(buffer, imageFilename, fileMimeType) {
    const params = {
        Bucket: myBucket,
        Key: imageFilename,
        Body: buffer,
        ContentType: fileMimeType,
    };
    const command = new PutObjectCommand(params);

    let response = await s3.send(command);
    let result = {};

    result["ok"] = (response["$metadata"]["httpStatusCode"] == 200) ? true : false;
    return result;
}

module.exports = {
    uploadToS3: uploadToS3
}