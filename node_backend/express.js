//Express server
const path = require('path');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');

const Post = require('./models/post');
const mongoose = require('mongoose');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log("Destination " + file.mimetype);
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let err = new Error('Invaid mime type');
    if (isValid) {
      err = null;
    }
    callback(err, 'node_backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    console.log("Filename " + name);

    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

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

//Static content
app.use("/images", express.static(path.join('node_backend/images')));

//Cross origin allow header middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

//npm install --save body-parser
app.post('/api/posts', multer({ storage: storage }).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({ //Mongoose Schema
    title: req.body.title,
    content: req.body.content,
    imagepath: url + '/images/' + req.file.filename
  });

  //Save to DB
  post.save().then(createdPost => {  //collection name will be plural form of the model - posts
    console.log(createdPost);
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id
      }
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
