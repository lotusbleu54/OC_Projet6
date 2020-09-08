//Chiffres, lettres, majuscules, minuscules, accents, chiffres et ponctuation basique autorisée
const inputsRegex = new RegExp("^[A-Za-zÀ-ÿ0-9'?!. ,;_-]+$");

//Définition du nombre de caractères min et max 
//(rq : on considère que les mêmes règles s'appliquent aux champs name, manufacturer et mainPepper)
const nameMinLength = 3;
const nameMaxLength = 50;
const descriptionMinLength = 10;
const descriptionMaxLength = 100;

module.exports = (req, res, next) => {
  try {
    if (req.file) { //Cas où il y a une image en plus dans la requête
        const sauceObject = {...JSON.parse(req.body.sauce)};
        if (sauceObject.name.length <= nameMinLength || sauceObject.name.length >= nameMaxLength || !(inputsRegex.test(sauceObject.name))
        || sauceObject.manufacturer.length <= nameMinLength || sauceObject.manufacturer.length >= nameMaxLength || !(inputsRegex.test(sauceObject.manufacturer))
        || sauceObject.mainPepper.length <= nameMinLength || sauceObject.mainPepper.length >= nameMaxLength || !(inputsRegex.test(sauceObject.mainPepper))
        || sauceObject.description.length <= descriptionMinLength || sauceObject.description.length >= descriptionMaxLength || !(inputsRegex.test(sauceObject.description)) ) {
            throw 'Invalid inputs !';
            } 
            else {
              next();
            }
    }
    else { //Cas où il n'y a pas d'image dans la requête, juste l'objet JSON
        if (req.body.name.length <= nameMinLength || req.body.name.length >= nameMaxLength || !(inputsRegex.test(req.body.name))
        || req.body.manufacturer.length <= nameMinLength || req.body.manufacturer.length >= nameMaxLength || !(inputsRegex.test(req.body.manufacturer))
        || req.body.mainPepper.length <= nameMinLength || req.body.mainPepper.length >= nameMaxLength || !(inputsRegex.test(req.body.mainPepper))
        || req.body.description.length <= descriptionMinLength || req.body.description.length >= descriptionMaxLength || !(inputsRegex.test(req.body.description)) ) {
            throw 'Invalid inputs !';
            } 
            else {
            next();
            }
    }
} 
  catch {
    res.status(400).json({
      error: new Error('Invalid request!')
    });
  }
};