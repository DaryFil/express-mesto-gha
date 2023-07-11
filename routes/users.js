const router = require('express').Router();
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, searchUserById, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');

const BadRequest = require('../errors/bad-request');

const validationId = (value) => {
  if (!mongoose.isValidObjectId(value)) {
    throw new BadRequest('Переданы некоректные данные при удалении карточки');
  } else { return value; }
};

// Создать нового пользователя:
// router.post('/', createUser);

// Получить данные пользователей:
router.get('/', getUsers);
// Получить данные пользователя по Id:
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().custom(validationId),
  }),
}), searchUserById);
// Получить информацию о текущем пользователе
router.get('/me', getUserInfo);
// Обновить профиль:
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
  }),
}), updateUser);
// Обновить аватар:
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
  }),
}), updateAvatar);

module.exports = router;
