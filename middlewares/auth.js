const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const handleAuthError = (res, req, next) => {
  next(new UnauthorizedError('Необходима авторизация'));
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res, req, next);
  }

  // const token = authorization.replace('Bearer ', '');
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'some-very-incredible-very-important-and-unbelievable-secret-key');
  } catch (err) {
    return handleAuthError(res, req, next);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
