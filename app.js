const { urlencoded } = require('express');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const app = express();
const multer = require('multer');
const path = require('path');

//connection to db
const dbUrl = 'mongodb+srv://mongo1:test123@nodetuts.vcus7.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('db connected');
        app.listen(3000);
    })
    .catch((err) => console.log(err));

//ejs 
app.set('view engine', 'ejs');

//middleware
app.use(express.static('public'));
//app.use(express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


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
app.get('/blog/:id', (req, res) => {
    const id = req.params.id;
    // console.log(id);

    Blog.findById(id)
        .then(result => {
            res.render('blog-view', { title: 'blog details', blog: result });
        })
        .catch(err => {
            console.log(err);
        });

})
app.post('/content', upload.single('media'), (req, res) => {
    const blog = new Blog({
        title: req.body.title,
        nickname: req.body.nickname,
        snippet: req.body.snippet,
        body: req.body.body,
        media: req.file.path
    });
    blog.save()
        .then((result) => {
            res.redirect('/content');
        })
        .catch((err) => console.log(err));

})
app.use((req, res) => {
    res.status(404).render('404', { 'title': 'Error' });
})