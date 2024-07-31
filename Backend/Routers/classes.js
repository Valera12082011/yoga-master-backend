const express = require('express');
const router = express.Router();
const Class = require('./models/classes');



// Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a class by ID
router.get('/:id', async (req, res) => {
  try {
    const classItem = await Class.findOne({classesId: req.params.id});
    if (!classItem) return res.status(404).json({ error: 'Class not found' });
    res.json(classItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new class
router.post('/', async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Оновити клас за classesId
router.put('/:id', async (req, res) => {
  try {
    // Оновлення даних класу
    const updateResult = await Class.updateOne(
      {_id : req.params.id }, // Знаходимо клас за ID
      {
        $set: {
          name: req.body.name || '', // Оновлюємо ім'я, якщо воно є
          schedule: req.body.schedule || [], // Оновлюємо розклад, якщо воно є
          instructor: req.body.instructor || null, // Оновлюємо інструктора, якщо він є
          students: req.body.students || [], // Оновлюємо студентів, якщо вони є
          reviews: req.body.reviews || [] // Оновлюємо відгуки, якщо вони є
        }
      }
    );

    // Перевірка, чи оновлення відбулося
    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Отримання оновлених даних
    const updatedClass = await Class.findById(req.params.id);
    if (!updatedClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Відправлення оновлених даних у відповіді
    res.json(updatedClass);
  } catch (error) {
    // Обробка помилок
    res.status(500).json({ error: error.message });
  }
});



// Delete a class by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) return res.status(404).json({ error: 'Class not found' });
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get students enrolled in a class
router.get('/:id/students', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id).populate('students');
    if (!classItem) return res.status(404).json({ error: 'Class not found' });
    res.json(classItem.students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enroll a student in a class
router.post('/:id/students', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) return res.status(404).json({ error: 'Class not found' });

    classItem.students.push(req.body.studentId); // studentId should be passed in the body
    await classItem.save();
    res.json(classItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get class schedule
router.get('/:id/schedule', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) return res.status(404).json({ error: 'Class not found' });
    res.json(classItem.schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update class schedule
router.put('/:id/schedule', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) return res.status(404).json({ error: 'Class not found' });

    classItem.schedule = req.body.schedule; // schedule should be passed in the body
    await classItem.save();
    res.json(classItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get class instructor
router.get('/:id/instructor', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id).populate('instructor');
    if (!classItem) return res.status(404).json({ error: 'Class not found' });
    res.json(classItem.instructor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update class instructor
router.put('/:id/instructor', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) return res.status(404).json({ error: 'Class not found' });

    classItem.instructor = req.body.instructorId; // instructorId should be passed in the body
    await classItem.save();
    res.json(classItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get class reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) return res.status(404).json({ error: 'Class not found' });
    res.json(classItem.reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a review for class
router.post('/:id/reviews', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) return res.status(404).json({ error: 'Class not found' });

    classItem.reviews.push(req.body); // Review should be passed in the body
    await classItem.save();
    res.json(classItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
