const router = require('express').Router();
const sequelize = require('../config/connection');
const {post,user,comment} = require('../models');

//the home will show the posts from the get go
router.get('/', (req, res) => {
    console.log(req.session);

    post.findAll({
        attributes: [
            'id',
            'title',
            'created_at',
            'post_text'
        ],
        include: [
            {
                model: comment,
                attributes: ['id', 'comment_text', 'post_id', 'created_at'],
                include: {
                    model: user,
                    attributes:['username', 'github']
                }
            },
            {
                model: user,
                attributes: ['username','github']
            }
        ]
    })
    .then(postData => {
        const posts = postData.map( post => post.get({ plain: true}));
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// for the login page
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

// the sign up
router.get('/signup', (req, res) => {
    if(req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
})

//get post from id
router.get('/post/:id', (req,res) => {
    post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'created_at',
            'post_text'
        ],
        include: [
            {
                model: comment,
                attributes: ['id', 'comment_text','post_id', 'user_id', 'created_at'],
                include: {
                    model: user,
                    attributes: ['username', 'github']
                }
            },
            {
               model:user,
               attributes: ['username', 'github']
            }
        ]
    })
    .then(postData => {
        if (!postData) {
            res.status(404).json({message:'Id not found'});
            return;
        }
       const post = postData.get({plain:true});
       
       res.render('single_post', {
        post,
        loggedIn: req.session.loggedIn
       });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;