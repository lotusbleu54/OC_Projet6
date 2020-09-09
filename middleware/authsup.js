const User = require('../models/User');
const Sauce = require('../models/Sauce');
const jwt = require('jsonwebtoken');

//Token caché
require('dotenv').config();

/*Même fonction que auth sauf qu'ici on cherche à savoir si l'utilisateur est l'administrateur 
ou la personne qui a créé la sauce qu'on cherche à modifier ou supprimer*/

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    Sauce.findOne({_id: req.params.id})
    .then(
        (sauce) => {
            User.findOne({_id: userId})
            .then(
              (user) => {
                if (user.email === process.env.DB_ADMIN_EMAIL) { //L'admin est autorisé
                  next();}
                else if ((req.body.userId && req.body.userId !== userId) || sauce.userId !== userId) { 
                    //Sinon seul l'utilisateur qui a ajouté la sauce est autorisé à la modifier ou à la supprimer
                  throw 'Invalid user ID';
                } else {
                  next();
                }}
            )
            .catch(
              (error) => {res.status(401).json({error});}
            );}
      )
      .catch(
        (error) => {res.status(400).json({error});}
      );

  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};