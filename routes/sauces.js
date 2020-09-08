const express = require('express');
const router = express.Router();

//Import du middleware auth pour sécuriser les routes
const auth = require('../middleware/auth');
//Import du middleware authsup pour n'autoriser que l'admin ou l'utilisateur qui a créé une sauce à la modifier ou supprimer
const authsup = require('../middleware/authsup');
//Import du middleware multer pour la gestion des images
const multer = require('../middleware/multer-config');
//Import du middleware de validation des inputs
const sauceInputValidation = require('../middleware/sauceInputValidation');

const saucesCtrl = require('../controllers/sauces');

router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/', auth, multer,  sauceInputValidation, saucesCtrl.createSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', authsup, multer, sauceInputValidation, saucesCtrl.modifySauce);
router.delete('/:id', authsup, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;