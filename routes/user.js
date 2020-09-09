const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.createAccountLimiter, userCtrl.signup);
router.post('/login', userCtrl.apiLimiter, userCtrl.login);

module.exports = router;