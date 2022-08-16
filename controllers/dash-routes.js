const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => { // get all single user posts

});

router.get('/edit/:id', withAuth, (req, res) => { // get single post from dashboard

});

module.exports = router;