const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  link: {
    required: [true, 'Поле "link" должно быть заполнено'],
    type: String,
    validate: {
      validator: (url) => /^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/.test(url),
      message: 'Некорректный URL',
    },
  },
  owner: {
    required: [true, 'Поле "owner" должно быть заполнено'],
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    default: Date.now,
    type: Date,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
