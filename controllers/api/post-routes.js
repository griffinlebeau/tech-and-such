const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => { // find all posts at /api/posts
    Post.findAll({ 
        attributes: [
            'id',
            'title',
            'text',
            'post_url',
            'created_at'
        ],
        include: [
            { // joins comment and post model so posts are found with all of their comments
                model: Comment, 
                attributes: ['id', 'text', 'post_id', 'user_id', 'created_at'],
                include: { // shows which user created each comment
                    model: User,
                    attributes: ['username']

                }
            },
            { // joins user and post models to show who created each post
                model: User,
                attributes: ['username']
            }
        ]
    })    
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => { // find one post by id
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'text',
            'post_url',
            'created_at'
        ],
        include: [
            { 
                model: Comment, 
                attributes: ['id', 'text', 'post_id', 'user_id', 'created_at'],
                include: { 
                    model: User,
                    attributes: ['username']

                }
            },
            { 
                model: User,
                attributes: ['username']
            }
        ]
    })    
    .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.post('/', withAuth, (req, res) => { // create post 
    Post.create({
        title: req.body.title,
        text: req.body.text,
        post_url: req.body.post_url,
        user_id: req.session.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', withAuth, (req, res) => { // update post by id
    Post.update(
        {
            title: req.body.title,
            text: req.body.text
        },
        {
            where: {
                id: req.params.id
            }
        }
    )    
    .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.delete('/:id', (req, res) => { // delete post by id
    Post.destroy({
        where: {
            id: req.params.id
          }
        })
          .then(dbPostData => {
            if (!dbPostData) {
              res.status(404).json({ message: 'No post found with this id' });
              return;
            }
            res.json(dbPostData);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
});

module.exports = router;