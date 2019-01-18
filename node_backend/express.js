//Express server
const express = require('express');
const app = express();
const bodyparser = require('body-parser');

const Post = require('./models/post');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://manoj:Zaq!xsw2cde3@cluster0-2m8vj.mongodb.net/mean').then(() => {
  console.log('connected to the databse');
}).catch(err => {
  console.log('connection failed', err);
});

//Add middleware
// app.use((req, resp, next) => {
//   console.log('First middleware');
//   next();
// });

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//Cross origin allow header middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

//npm install --save body-parser
app.post('/api/posts', (req, res, next) => {
  const post = new Post({ //Mongoose Schema
    title: req.body.title,
    content: req.body.content
  });

  //Save to DB
  post.save().then(createdPost => {  //collection name will be plural form of the model - posts
    console.log(createdPost);
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });   //201 - Add new resource
  });

});

app.get('/api/posts', (req, res, next) => {
  //Retrieve documents
  Post.find().then(documents => { //not really a Promise
    res.status(200).json({
      message: 'posts fetched successfully',
      posts: documents
    });
  });
});

app.delete('/api/posts/delete/:id', (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: (req.params.id) }).then(resp => {
    console.log(resp);
  }).catch(err => {
    console.log(err);
  });

  res.status(200).json({
    message: 'posts deleted successfully'
  });
});

app.put('/api/posts/update/:id', (req, resp, next) => {
  const post = new Post({ //Mongoose Schema
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });

  Post.updateOne({ _id: req.params.id }, post)
    .then(result => {
      resp.status(200).json({ message: 'updated successfully' });
    }).catch(err => {
      console.log(err.message);
    });
});

app.get('/api/posts/edit/:id', (req, res, next) => {
  //Retrieve one document
  Post.findById(req.params.id).then(document => { //not really a Promise
    res.status(200).json({
      message: 'post fetched successfully',
      post: document
    });
  });
});

module.exports = app;
