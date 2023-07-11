const mongoose = require('mongoose');

const BadRequest = require('../errors/bad-request');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const Card = require('../models/card');

// Создание новой карточки
module.exports.createCard = (req, res, next) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  const owner = req.user;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      console.log(error);
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(error);
      }
    });
};

// Получение карточек из бд
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((error) => next(error));
};

// Удаление карточки
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findById({ _id: cardId })
    .then((cardInfo) => {
      if (cardInfo) {
        if (cardInfo.owner._id.toString() === userId) {
          Card.findByIdAndRemove({ _id: cardId })
            .then((card) => {
              if (card) {
                res.send({ data: cardId });
              }
            })
            .catch((error) => next(error));
        } else { next(new ForbiddenError('Вы не создатель карточки')); }
      } else {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
    })
    .catch((error) => {
      if (error instanceof mongoose.CastError) {
        next(new BadRequest('Переданы некоректные данные при удалении карточки'));
      } else {
        next(error);
      }
    });
};

// Поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else { throw new NotFoundError('Передан несуществующий _id карточки'); }
    })
    .catch((error) => {
      if (error instanceof mongoose.CastError) {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(error);
      }
    });
};

// Удалить лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else { throw new NotFoundError('Передан несуществующий _id карточки'); }
    })
    .catch((error) => {
      if (error instanceof mongoose.CastError) {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(error);
      }
    });
};
