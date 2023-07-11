// Подключение необходимых модулей и файлов
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { auth } = require('./middlewares/auth');
const {
  createUser, login,
} = require('./controllers/users');
// const NotFoundError = require('./errors/not-found-err');
const error = require('./middlewares/error');
// Создание экземпляра приложения Express
const app = express();
// Применение промежуточного ПО для обеспечения безопасности
app.use(helmet());
// Отключение заголовка "x-powered-by"
app.disable('x-powered-by');

// Определение порта из переменной окружения
const { PORT = 3000 } = process.env;
// Подключение к базе данных MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(auth);

app.use('/users', auth, require('./routes/users'));

app.use('/cards', auth, require('./routes/cards'));
app.use('/', auth, require('./routes/index'));

app.use(errors());
app.use(error);
app.use(require('./middlewares/error'));

// Создать нового пользователя
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// Запуск сервера на указанном порту
app.listen(PORT);
