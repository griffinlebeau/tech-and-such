const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

router.get('/', (req, res) => { // get all users 
    User.findAll({
        attributes: { exclude: ['passwprd'] }
    })    
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => { // get one user by id
    User.findOne({
        attributes: { exclude: ['passwprd'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'text', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    })    
    .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.post('/', (req, res) => { // create user 
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })    
    .then(dbUserData => {
        req.session.save(() => {
          req.session.user_id = dbUserData.id;
          req.session.username = dbUserData.username;
          req.session.loggedIn = true;
    
          res.json(dbUserData);
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.post('/login', (req, res) => { // user login
    User.findOne({
        where: {
            email: req.body.email
          }
        }).then(dbUserData => {
          if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
          }
      
          const validPassword = dbUserData.checkPassword(req.body.password);
      
          if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
          }
      
          req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
        
            res.json({ user: dbUserData, message: 'You are now logged in!' });
          });
        });
    });     

router.post('/logout', (req, res) => { // user logout
    if (req.session.loggedIn) {
        req.session.destroy(() => {
          res.status(204).end();
        });
      }
      else {
        res.status(404).end();
      }
});

router.put('/:id', (req, res) => { // update user by id
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })    
    .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.delete('/:id', (req, res) => { // delete user by id
    User.destroy({
        where: {
            id: req.params.id
          }
        })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
});

module.exports = router;
 