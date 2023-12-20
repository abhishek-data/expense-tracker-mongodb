const AWS = require('aws-sdk')


const uploadToS3 = (file, filename) => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY
    })
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: file,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (err) {
                console.log("err", err);
                reject(err)
            }
            resolve(data.Location)
        })
    })
}

module.exports = {
    uploadToS3
}