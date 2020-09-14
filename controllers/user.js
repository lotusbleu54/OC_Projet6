const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!\?@\.#\$%\^&\*])(?=.{8,})");
// Mot de passe fort avec au moins 8 caractères dont au moins 1 minuscule, 1 majuscule, 1 chiffre, et 1 caractère spécial

//Limiter la création de trop de comptes et trop de tentatives de connection
const rateLimit = require("express-rate-limit");

exports.apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // Fenêtre de 5 minutes
    max: 3, //3 tentatives de connections max depuis cette IP
    message: "Trop de tentatives de connection depuis cette IP, veuillez réessayer ultérieurement"
  });

exports.createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // Fenêtre d'1 heure
    max: 2, // 2 comptes créés max depuis cette IP
    message:
      "Trop de tentatives de créations de compte depuis cette IP, veuillez réessayer ultérieurement"
  });

exports.signup = (req, res, next) => {
    if (passwordRegex.test(req.body.password)) { //Si la sécurité du mot de passe correspond au critère demandé
      bcrypt.hash(req.body.password, 10) //Algoryhtme de hashage du mot de passe
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash //Le hash est sauvegardé dans la base et non le mot de passe en clair
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    }
    else {
      res.status(400).json({error: 'Mot de passe doit inclure au moins 8 caractères dont au moins 1 minuscule, 1 majuscule, 1 chiffre, et 1 caractère spécial'});
    }
}

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) { //Cas où il n'y a pas d'utilisateur enregistré avec cette adresse e-mail
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) //Comparaison des hashs pour voir si le mot de passe est valide
          .then((valid) => {
            if (!valid) {return res.status(401).json({ error: 'Mot de passe incorrect !' });}
            else {res.status(200).json({ //Retourne le User Id et le Token
                userId: user._id,
                token: jwt.sign({ userId: user._id },process.env.TOKEN,{ expiresIn: '24h' })
            });}
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

/* Permet d'effacer un user de la base au besoin
exports.deleteUser = (req, res, next) => {
    User.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Utilisateur supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      };
*/