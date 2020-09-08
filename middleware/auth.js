const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'THIS_IS_A_TOP_6CRET&RANDOM_TOKEN');
    const userId = decodedToken.userId;
    User.findOne({_id: userId})
    .then(
      (user) => {
        if (user.email ==='admin@pekocko.com') {
          next();}
        else if (req.body.userId && req.body.userId !== userId) {
          throw 'Invalid user ID';
        } else {
          next();
        }}
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