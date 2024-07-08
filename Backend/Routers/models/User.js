const mongoose = require('mongoose');

const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  id: { type: String, required: true, unique: true, default: uuidv4 },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  avatar: { type: Buffer }, // Поле для зберігання аватара у вигляді буфера
  additionalInfo: { type: String } // Додаткова інформація про користувача
});


const User = mongoose.model('User', usersSchema);

module.exports = User;
