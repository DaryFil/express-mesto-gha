const router = require('express').Router();
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, searchUserById, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');

const BadRequest = require('../errors/bad-request');
const { URL_REGEX } = require('../utils/constants');

const validationId = (value) => {
  if (!mongoose.isValidObjectId(value)) {
    throw new BadRequest('Переданы некоректные данные при удалении карточки');
  } else { return value; }
};

// Получить данные пользователей:
router.get('/', getUsers);

// Получить информацию о текущем пользователе
router.get('/me', getUserInfo);

// Обновить профиль:
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

// Обновить аватар:
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(URL_REGEX),
  }),
}), updateAvatar);

// Получить данные пользователя по Id:
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom(validationId),
  }),
}), searchUserById);

module.exports = router;
