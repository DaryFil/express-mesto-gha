// Подключение необходимых модулей и файлов
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const {
  createUser, login,
} = require('./controllers/users');
const { signUpCelebrate, signInCelebrate } = require('./validators/users');

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

app.use(express.json());
app.use(cookieParser());

app.post('/signin', signInCelebrate, login);

// Создать нового пользователя
app.post('/signup', signUpCelebrate, createUser);

app.use('/', auth, require('./routes/index'));

app.use(errors());

app.use(require('./middlewares/error'));
// Запуск сервера на указанном порту
app.listen(PORT);
