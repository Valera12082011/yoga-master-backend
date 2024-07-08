const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;

const ClassesSchema = new Schema({
  id: { type: String, required: true, unique: true, default: uuidv4 },
  name: { type: String, required: true },
  time: {type: String , default: new Date().toLocaleString()},
  password: { type: String, required: true },
  admins: [{
    id: {type: String, required: true }
  }],
  description: {type: String , required: true},
  teachers: [{
    id: {type: String, required: true }
  }],
  results: [{
    msg: {type: String},
    id: {type: String, required: true },
    time: {type: String , default: new Date().toLocaleString()},
    leval: {type: String}
  }],

});

const Classes = mongoose.model('Classes', ClassesSchema);

module.exports = Classes;
