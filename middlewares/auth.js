const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err').default;

module.exports.auth = (req, res, next) => {
  const { jwt: token } = req.cookies;
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(
      token,
      'some-very-incredible-very-important-and-unbelievable-secret-key',
    );
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  req.user = payload;
  next();
};

// const { authorization } = req.headers;

// if (!authorization || !authorization.startsWith('Bearer ')) {
//   return handleAuthError(res, req, next);
// }

// const token = authorization.replace('Bearer ', '');
//   const token = extractBearerToken(authorization);
//   let payload;

//   try {
//   payload = jwt.verify(token, 'some-very-incredible-very-important-and-unbelievable-secret-key');
//   } catch (err) {
//     return handleAuthError(res, req, next);
//   }

//   req.user = payload; // записываем пейлоуд в объект запроса

//   return next(); // пропускаем запрос дальше
// };
