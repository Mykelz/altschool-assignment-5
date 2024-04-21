const User = require('../models/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) =>{

    try{
        const { name, email, password } = req.body;
        const hashedPw = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name,
            email: email,
            password: hashedPw
        })
        res.status(201).json({
            message: 'user created',
            data: { 
                id: user._id,
                name: user.name,
                email: user.email,
                updatedAt: user.updatedAt,
                createdAt: user.createdAt
              }  

        })
    }catch(err){
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.login = async (req, res, next) =>{
    try{
        const { email, password } = req.body;

        const user = await User.findOne({email: email});
    
        if (!user){
            const error = new Error('No user is associated with this email');
            error.statusCode = 401;
            throw error;
        }
    
       const isEqual = await bcrypt.compare(password, user.password)
       if(!isEqual){
            const error = new Error('Wrong password')
            error.statusCode = 401;
            throw error;
       }
       const token = jwt.sign(
        { email: user.email, userId: user._id},
        process.env.JWT_SECRET,
        { expiresIn: '1hr'}
      );
      res.status(200).json({
        message: 'Login Successfull',
        data: {
            accessToken: 'Bearer ' + token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                updatedAt: user.updatedAt,
                createdAt: user.createdAt
            } 
            }
        })
    }catch(err){
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}
