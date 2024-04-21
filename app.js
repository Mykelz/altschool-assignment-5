const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');


const app = express();

app.use(bodyParser.json())


app.use(authRoutes);
app.use(postRoutes);

app.use((error, req, res, next) =>{
    const data = error.data;
    const status = error.statusCode || 500;
    const message = error.message || 'an error occcured';
    res.status(status).json({ message: message, data: data})
  })

mongoose.connect(process.env.CONNECT).then(connection=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`app is listening on port ${process.env.PORT}`)
    })
}).catch(err=>{
    console.log(err)
})

