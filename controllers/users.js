const {
  SUCCESS_CODE_200, SUCCESS_CODE_201, ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500,
} = require('../utils/constants');
const User = require('../models/user');

// Создать нового пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(SUCCESS_CODE_201).send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Получение пользователей из бд
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка' }));
};

// Поиск пользователя по id
module.exports.searchUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else { res.status(ERROR_CODE_404).send({ message: 'Пользователь по указанному _id не найден.' }); }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(ERROR_CODE_400).send({ message: 'Передан неккоректный _id пользователя' });
      } else {
        res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Обновить данные профиля
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(SUCCESS_CODE_200).send(user))
    .catch((error) => {
      if (error.name === 'CastError' || error.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({
          message:
            'Переданы некорректные данные при обновлении профиля',
        });
      }

      if (error.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_404).send({
          message: 'Пользователь с указанным id не найден',
        });
      }

      return res
        .status(ERROR_CODE_500)
        .send({
          message:
            'На сервере произошла ошибка',
        });
    });
};

// Обновить аватар пользователя
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail()
    .then((user) => res.status(SUCCESS_CODE_200).send(user))
    .catch((error) => {
      if (error.name === 'CastError' || error.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({
          message:
            'Переданы некорректные данные при обновлении аватара',
        });
      }

      if (error.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_404).send({
          message: 'Пользователь с указанным id не найден',
        });
      }

      return res
        .status(ERROR_CODE_500)
        .send({
          message:
            'На сервере произошла ошибка',
        });
    });
};
