const Post = require('../models/post.js');
const User = require('../models/auth');

exports.createPost = async (req, res, next)=>{
    try {
        const { title, body } = req.body;
        const post = await Post.create({
            title: title,
            body: body,
            user: req.user
        })
        const user = await User.findById(req.user)
        user.post.push(post)
        const updatedUser = await user.save();

        res.status(201).json({
            message: 'Post created', 
            data: { 
              id: post.id,
              title: post.title,
              body: post.body,
              user: { 
                id: user.id,
                name: user.name,
                email: user.email,
                updatedAt: user.updatedAt,
                createdAt: user.createdAt
              },
              updatedAt: post.updatedAt,
              createdAt: post.createdAt
            }  
        })
        
    }catch(err){
        if (!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }

}

exports.updatePost = async (req, res, next)=>{
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        const user = await User.findById(req.user);
        const userId = user._id
        if(!user){
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            throw error
        }
        if (post.user.toString() !== userId.toString()){
            const error = new Error('Only users that created a post can delete it');
            error.statusCode = 401;
            throw error
        }
        const { title, body } = req.body;
        post.title = title;
        post.body = body;

        const updatedPost = await post.save();

        res.status(200).json({
            message: 'Post updated successfully', 
            data: { 
              id: updatedPost.id,
              title: updatedPost.title,
              body: updatedPost.body,
              user: { 
                id: user.id,
                name: user.name,
                email: user.email,
                updatedAt: user.updatedAt,
                createdAt: user.createdAt
              },
              updatedAt: post.updatedAt,
              createdAt: post.createdAt
            }  
        })
    }catch(err){
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    }    
}

exports.getAllPost = async (req, res, next)=>{

    try{
        const { limit = 10, page = 1} = req.query;
        const posts = await Post.find()
            .sort({ createdAt: 'desc'})
            .skip( (page - 1) * limit)
            .limit(limit)
            .populate('user', 'id name email updatedAt createdAt')
            .exec();
     
        res.status(200).json({
            message: 'All posts',
            data: posts
        })

    }catch(err){
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }


    

}

exports.getPostById = async (req, res, next)=>{
    try{
        const postId = req.params.postId;
        const post = await Post.findById(postId)
            .populate('user', 'id name email updatedAt createdAt')
            .exec();

        res.status(200).json({
            message: 'Post',
            data: post
        })
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    }
}

exports.deletePost = async (req, res, next)=>{
    try{
        const postId = req.params.postId;
        const deletedPost = await Post.findByIdAndDelete(postId);

        res.status(200).json({
            message: 'Post deleted',
            data: deletedPost
        })
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    }

}