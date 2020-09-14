const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.createAccountLimiter, userCtrl.signup);
router.post('/login', userCtrl.apiLimiter, userCtrl.login);
//router.delete('/:id', userCtrl.deleteUser); //Permet d'effacer un utilisateur au besoin

module.exports = router;