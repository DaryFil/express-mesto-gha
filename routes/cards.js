const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

// Создать новую карточку:
router.post('/', createCard);
// Получить карточки из бд:
router.get('/', getCards);
// Удалить карточку по id:
router.delete('/:cardId', deleteCard);
// Поставить лайк карточке:
router.put('/:cardId/likes', likeCard);
// Удалить лайк с карточки:
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
