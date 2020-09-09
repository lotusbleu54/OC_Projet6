const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');  // plugin de sécurité pour les requêtes HTTP, les headers, protection XSS, détection du MIME TYPE...

//Import des routes
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

//Données DB Mongo cachées
require('dotenv').config();

//Connection à la base MongoDB
mongoose.connect('mongodb+srv://'+process.env.DB_LOGIN+':'+process.env.DB_PASSWORD+"@"+process.env.DB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(helmet()); // Exécution du plugin de sécurité

//Pour contourner les erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//Requêtes exploitables
app.use(bodyParser.json());

//Gestion de la ressource image de façon statique
app.use('/images', express.static(path.join(__dirname, 'images')));

//Routes de l'API
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;