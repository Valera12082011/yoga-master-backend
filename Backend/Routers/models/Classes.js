const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');
// Визначення схеми для класу
const classSchema = new Schema({
  classesId : {
    type: String, 
    required: true, 
    unique: true, 
    default: uuidv4
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: 'Instructor', // Вказує на модель інструктора, якщо є
    required: true
  },
  students: [{
    user_id: {
        type: String
    },
    name: {
        type: String
    }
  }],
  reviews: [{
    reviewer: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    }
  }]
}, {
  timestamps: true // Додає поля createdAt і updatedAt
});

// Створення моделі з використанням схеми
const Class = mongoose.model('Class', classSchema);

module.exports = Class;
