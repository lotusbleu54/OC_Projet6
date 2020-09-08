const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit"); //Limiter la création de trop de comptes et trop de tentatives de connection

const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // Fenêtre de 5 minutes
    max: 3, //3 tentatives de connections max depuis cette IP
    message: "Trop de tentatives de connection depuis cette IP, veuillez réessayer ultérieurement"
  });

const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // Fenêtre d'1 heure
    max: 2, // 2 comptes créés max depuis cette IP
    message:
      "Trop de tentatives de créations de compte depuis cette IP, veuillez réessayer ultérieurement"
  });

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', apiLimiter, userCtrl.login);

module.exports = router;