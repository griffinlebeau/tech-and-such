const router = require('express').Router();

const apiRoutes = require('./api/');
const homeRoutes = require('./home-routes');
const dashRoutes = require('./dash-routes');

router.use('/', homeRoutes);
router.use('/dash', dashRoutes);
router.use('/api', apiRoutes);

module.exports = router;