// Подключение необходимых модулей и файлов
const express = require('express');
const mongoose = require('mongoose');

// Создание экземпляра приложения Express
const app = express();

const bodyParser = require('body-parser');

const {
  ERROR_CODE_404,
} = require('./utils/constants');

// Определение порта из переменной окружения
const { PORT = 3000 } = process.env;

// Подключение к базе данных MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '649db1a8dd10601c7b7ce2b6',
  };
  next();
});

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(ERROR_CODE_404).send({ message: 'Неверный путь' });
});

// Запуск сервера на указанном порту
app.listen(PORT);
