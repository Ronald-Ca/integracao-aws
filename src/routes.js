const multer = require('multer');
const routes = require('express').Router();
const multerConfig = require('./config/multer');

const {
    S3
} = require("@aws-sdk/client-s3");
const s3 = new S3(
    {
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        }
    }
);

const Post = require('./models/Post');

routes.get('/posts', async (req, res) => {
    const posts = await Post.find()

    return res.json(posts)
})

routes.post('/posts', multer(multerConfig).single('file'), async (req, res) => {

    const { originalname: name, size, key, location: url = '' } = req.file;

    const post = await Post.create({
        name,
        size,
        key,
        url,
    })
    return res.json(post)
})

routes.delete('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log(post)
        if (!post) return res.status(400).send({ error: 'Post not found' });

        // Excluir o objeto do S3
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: post.key
        };
        await s3.deleteObject(params)
        // .then(async (res) => {
        //     console.log('oi', res)
        //     return res.send({ message: 'Post deleted' });
        // }).catch((err) => {
        //     console.log(err)
        // });

        // Excluir o post do banco de dados
        await Post.findByIdAndRemove(post._id);

        return res.send({ message: 'Post not deleted' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Could not delete post' });
    }

    // try {
    //     const post = await Post.findById(req.params.id);
    //     console.log(post)
    //     await Post.findByIdAndRemove(post.id)

    //     return res.send({ message: 'Post deleted' });
    // } catch (err) {
    //     console.log(err);
    //     return res.status(500).json({ error: 'Could not delete post' });
    // }
});

module.exports = routes