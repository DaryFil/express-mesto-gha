const router = require('express').Router();

const {
  createUser, getUsers, searchUserById, updateUser, updateAvatar,
} = require('../controllers/users');

// Создать нового пользователя:
router.post('/', createUser);
// Получить данные пользователей:
router.get('/', getUsers);
// Получить данные пользователя по Id:
router.get('/:userId', searchUserById);
// Обновить профиль:
router.patch('/me', updateUser);
// Обновить аватар:
router.patch('/me/avatar', updateAvatar);

module.exports = router;
