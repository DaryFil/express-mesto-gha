const router = require('express').Router();

const {
  getUsers, searchUserById, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');

const { updateUserCelebrate, userIdCelebrate, updateAvatarCelebrate } = require('../validators/users');

// Получить данные пользователей:
router.get('/', getUsers);

// Получить информацию о текущем пользователе
router.get('/me', getUserInfo);

// Обновить профиль:
router.patch('/me', updateUserCelebrate, updateUser);

// Обновить аватар:
router.patch('/me/avatar', updateAvatarCelebrate, updateAvatar);

// Получить данные пользователя по Id:
router.get('/:userId', userIdCelebrate, searchUserById);

module.exports = router;
