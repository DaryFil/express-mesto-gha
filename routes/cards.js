const router = require('express').Router();
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const BadRequest = require('../errors/bad-request');
const { URL_REGEX } = require('../utils/constants');

const validationId = (value) => {
  if (!mongoose.isValidObjectId(value)) {
    throw new BadRequest('Переданы некоректные данные при удалении карточки');
  } else { return value; }
};

// Создать новую карточку:
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(URL_REGEX),
  }),
}), createCard);

// Получить карточки из бд:
router.get('/', getCards);

// Удалить карточку по id:
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(validationId),
  }),
}), deleteCard);

// Поставить лайк карточке:
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(validationId),
  }),
}), likeCard);

// Удалить лайк с карточки:
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(validationId),
  }),
}), dislikeCard);

module.exports = router;
