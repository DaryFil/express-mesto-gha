const router = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { cardCreateCelebrate, cardIdCelebrate } = require('../validators/cards');

// Создать новую карточку:
router.post('/', cardCreateCelebrate, createCard);

// Получить карточки из бд:
router.get('/', getCards);

// Удалить карточку по id:
router.delete('/:cardId', cardIdCelebrate, deleteCard);

// Поставить лайк карточке:
router.put('/:cardId/likes', cardIdCelebrate, likeCard);

// Удалить лайк с карточки:
router.delete('/:cardId/likes', cardIdCelebrate, dislikeCard);

module.exports = router;
