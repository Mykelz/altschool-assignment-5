const express = require('express');

const postController = require('../controllers/post');
const isAuth = require('../middleware/is-auth')

const router = express.Router();



router.post('/posts', isAuth, postController.createPost);

router.patch('/posts/:postId', isAuth, postController.updatePost);

router.get('/posts', isAuth, postController.getAllPost);

router.get('/posts/:postId', isAuth, postController.getPostById);

router.delete('/posts/:postId', isAuth, postController.deletePost);



module.exports = router;