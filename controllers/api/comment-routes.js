const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => { // get all comments 
    Comment.findAll() // query db for all comments at get /api/comments
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) => { // called from submit button
    Comment.create({ // create comment at post /api/comments
        text: req.body.text, // textarea in comment form 
        user_id: req.session.user_id,
        post_id: req.body.post_id // from saved session
    })
    .then(dbCommentData => res.json(dbCommentData)) // returns object of new comment
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', withAuth, (req, res) => { // delete comment by id
    Comment.destroy({ // remove comment from db at fetch delete 
        where: { 
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if (!dbCommentData) {
          res.status(404).json({ message: 'No comment found with this id!' });
          return;
        }
        res.json(dbCommentData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

module.exports = router;
