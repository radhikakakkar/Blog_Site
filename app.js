const { urlencoded } = require('express');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const app = express();
const multer = require('multer');

//connection to db
const dbUrl = 'mongodb+srv://mongo1:test123@nodetuts.vcus7.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

//ejs 
app.set('view engine', 'ejs');

//middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

//routes
app.get('/', (req, res) => {
    res.redirect('/content');
});

app.get('/create', (req, res) => {
    res.render('create', { title: 'create content' });

})
app.get('/content', (req, res) => {
    //finding all the data from the db 
    Blog.find()
        .then((result) => {
            res.render('blogs', { title: 'all content', blogs: result });
        })
        .catch((err) => {
            console.log(err);
        });
})
app.post('/content', (req, res) => {
    console.log(req.body);
    const blog = new Blog(req.body);
    //saving blog to the db
    blog.save()
        .then((result) => {
            res.redirect('/content');
        })
        .catch((err) => console.log(err));

})
app.use((req, res) => {
    res.status(404).render('404', { 'title': 'Error' });
})