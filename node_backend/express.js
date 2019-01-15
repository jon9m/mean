//Express server
const express = require('express');
const app = express();
const bodyparser = require('body-parser');

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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

//npm install --save body-parser
app.post('/api/posts', (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  });   //201 - Add new resource
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    { id: '1', title: 'Title 1', content: 'Title 1 Content' },
    { id: '2', title: 'Title 2', content: 'Title 2 Content' },
    { id: '3', title: 'Title 2', content: 'Title 3 Content' },
    { id: '4', title: 'Title 2', content: 'Title 4 Content' },
    { id: '5', title: 'Title 2', content: 'Title 5 Content' }
  ];

  res.status(200).json({
    message: 'posts fetched successfully',
    posts: posts
  });
});

module.exports = app;
