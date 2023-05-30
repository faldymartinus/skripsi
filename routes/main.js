const express = require('express');
const {mainView, configView } = require('../controllers/mainController');
const router = express.Router();

router.get('/config', configView);
router.get('/main', mainView);

module.exports = router;
