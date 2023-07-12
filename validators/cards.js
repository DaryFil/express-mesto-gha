const { celebrate, Joi } = require('celebrate');

const URL_REGEX = require('../utils/constants');

module.exports.cardCreateCelebrate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(URL_REGEX),
  }),
});

module.exports.cardIdCelebrate = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});
