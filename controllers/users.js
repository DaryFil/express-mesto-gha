const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const bcrypt = require('bcrypt'); // импортируем bcrypt
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const ConflictError = require('../errors/conflict-err');

// Создать нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.send({
      data: {
        name, about, avatar, email,
      },
    }))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      } else if (error.code === 11000) {
        next(new ConflictError('Данный email уже зарегистрирован'));
      } else { next(error); }
    });
};

// Получение пользователей из бд
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((error) => next(error));
};

// Поиск пользователя по id
module.exports.searchUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
    })
    .catch((error) => {
      if (error instanceof mongoose.CastError) {
        next(new BadRequest('Передан некорректный _id пользовтателя'));
      } else {
        next(error);
      }
    });
};
function updateUserInfo(req, res, next, data) {
  User.findByIdAndUpdate(req.user._id, data, { runValidators: true, context: 'query', new: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest('Переданы некорректные данные при обновлении пользовтателя'));
      } else {
        next(err);
      }
    });
}
// Обновить данные профиля
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  updateUserInfo(req, res, next, { name, about });
};

// Обновить аватар пользователя
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateUserInfo(req, res, next, { avatar });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'some-very-incredible-very-important-and-unbelievable-secret-key', { expiresIn: '7d' }),
      });
    })
    .catch(() => {
      next();
    });
};

module.exports.getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else { throw new NotFoundError('Пользователь с указанным _id не найден.'); }
    })
    .catch((err) => {
      if (err instanceof mongoose.CastError) {
        next(new BadRequest('Передан некорректный _id пользователя'));
      } else {
        next(err);
      }
    });
};
