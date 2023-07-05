// const mongoose = require('mongoose');
// const fs = require('fs');
// const path = require('path');
// const { S3 } = require('@aws-sdk/client-s3');

// const s3 = new S3({
//     region: process.env.REGION,
//     credentials: {
//         accessKeyId: process.env.ACCESS_KEY_ID,
//         secretAccessKey: process.env.SECRET_ACCESS_KEY,
//     },
// });

// const PostSchema = new mongoose.Schema({
//     name: String,
//     size: Number,
//     key: String,
//     url: String,
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });

// PostSchema.pre('remove', async function () {
//     const bucketName = process.env.BUCKET_NAME;
//     const objectKey = this.key;

//     try {
//         await s3.headObject({ Bucket: bucketName, Key: objectKey }).promise();
//         await s3.deleteObject({ Bucket: bucketName, Key: objectKey }).promise();
//         console.log(`Object with key "${objectKey}" deleted from bucket "${bucketName}".`);
//     } catch (err) {
//         console.error(`Error deleting object with key "${objectKey}" from bucket "${bucketName}": ${err.message}`);
//     }

//     if (process.env.STORAGE_TYPE !== 's3') {
//         await fs.promises.unlink(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', this.key));
//     }
// });

// module.exports = mongoose.model('Post', PostSchema);



const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const {
    S3
} = require("@aws-sdk/client-s3")

const s3 = new S3(
    {
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        }
    }
)

const PostSchema = new mongoose.Schema({
    name: String,
    size: Number,
    key: String,
    url: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

PostSchema.pre('save', function () {
    if (!this.url) {
        this.url = `${process.env.APP_URL}/files/${this.key}`
    }
})

// PostSchema.pre('remove', function () {
//     if (process.env.STORAGE_TYPE === 's3') {
//         return s3
//             .deleteObject({
//                 Bucket: process.env.BUCKET_NAME,
//                 Key: this.key,
//                 VersionId: 'null',
//             }, (err, data) => {
//                 console.log(err, data)
//             }).promise()
//     } else {
//         return promisify(fs.unlink)(
//             path.resolve(__dirname, '..', '..', 'tmp', 'uploads', this.key)
//         )
//     }
// })

module.exports = mongoose.model('Post', PostSchema)