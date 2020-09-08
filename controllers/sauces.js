const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes:0,
    dislikes:0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save().then(
    () => {
      res.status(201).json({message: 'Sauce enregistrée !'});
    }
  ).catch(
    (error) => {
      res.status(400).json({error});
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then(
    (sauce) => {res.status(200).json(sauce);}
  )
  .catch(
    (error) => {res.status(404).json({error});}
  );
};

exports.modifySauce = (req, res, next) => {
  if (req.file) {
    const sauceObject = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
      })
    })
    .catch(error => res.status(500).json({ error }));
  }
  else {
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
  }
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;
    Sauce.findOne({_id: req.params.id})
    .then(
      (sauce) => {
        var likes = sauce.likes;
        var dislikes = sauce.dislikes;
        var usersLiked = sauce.usersLiked;
        var usersDisliked = sauce.usersDisliked;
        if (like==1 && !(usersLiked.includes(userId))) {
          likes+=1;
          usersLiked.push(userId);
        }
        else if (like==-1 && !(usersDisliked.includes(userId))) {
          dislikes+=1;
          usersDisliked.push(userId);
        }
        else if (like == 0 && usersLiked.includes(userId)) {
          likes-=1;
          var index = usersLiked.indexOf(userId);
              if (index > -1) {
                  usersLiked.splice(index, 1);
              }
        }
        else if (like == 0 && usersDisliked.includes(userId)) {
          dislikes-=1;
          var index = usersDisliked.indexOf(userId);
              if (index > -1) {
                  usersDisliked.splice(index, 1);
              }
        }
    Sauce.updateOne({ _id: req.params.id }, {
      likes:likes,
      dislikes:dislikes,
      usersLiked:usersLiked,
      usersDisliked:usersDisliked,
      _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Like pris en compte'}))
    .catch(error => res.status(400).json({ error }));
      }
    )
    .catch((error) => {res.status(404).json({error});});
}
        