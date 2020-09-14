const jwt = require('jsonwebtoken');

//Token caché
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) { //Vérification du token
          throw 'Invalid user ID';
    } 
    else {next();} //Si identification correcte, on autorise l'exécution du script suivant
  } 
  catch {res.status(401).json({error: new Error('Invalid request!')})}
}