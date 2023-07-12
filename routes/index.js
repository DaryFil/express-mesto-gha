const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use((req, res, next) => {
  next(new NotFoundError('Неверный путь'));
});

module.exports = router;
