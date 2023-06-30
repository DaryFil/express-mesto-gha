const {
  SUCCESS_CODE_200, ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500,
} = require('../utils/constants');

const Card = require('../models/card');

// Создание новой карточки
module.exports.createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      console.log(error);
      if (error.name === 'CastError' || error.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Получение карточек из бд
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка' }));
};

// Удаление карточки
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove({ _id: cardId })
    .then((card) => {
      if (card) {
        res.send({ data: cardId });
      } else {
        res.status(ERROR_CODE_404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(ERROR_CODE_400).send({ message: 'Не верный _id карточки' });
      } else {
        res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(SUCCESS_CODE_200).send(card))
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        return res
          .status(ERROR_CODE_404)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      if (error.name === 'CastError') {
        return res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные для постановки / снятия лайка',
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

// Удалить лайк с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => res.status(SUCCESS_CODE_200).send(card))
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        return res
          .status(ERROR_CODE_404)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      if (error.name === 'CastError') {
        return res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные для постановки / снятия лайка',
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
