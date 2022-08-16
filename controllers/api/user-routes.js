const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

router.get('/', (req, res) => { // get all users 
    User.findAll({

    });
});

router.get('/:id', (req, res) => { // get one user by id
    User.findOne({

    });
});

router.post('/', (req, res) => { // create user 
    User.create({

    });
});

router.post('/login', (req, res) => { // user login
    User.findOne({

    });
}) 

router.post('/logout', (req, res) => { // user logout

});

router.put('/:id', (req, res) => { // update user by id
    User.update({

    });
});

router.delete('/:id', (req, res) => { // delete user by id
    User.destroy({

    });
})

module.exports = router;
 