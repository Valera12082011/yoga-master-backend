const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const User = require('./models/User'); // Підключаємо модель користувача
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key'; // Замініть на ваш ключ
const COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів в мілісекундах
  // secure: true, // Розкоментуйте для використання тільки з HTTPS
};

router.use(bodyParser.json())
router.post('/add_user', async (req, res) => {
  try {
      const { name, age, email, password, role, additionalInfo , avatar } = req.body;
      console.log(req.body)
      // Базова перевірка даних
      if (!name || !age || !email || !password || !role) {
          return res.status(400).json({ msg: 'Please provide all required fields' });
      }

      // Перевірка, чи існує вже користувач з таким паролем
      const Passowrd = await User.findOne({ password: crypto.createHash('sha256').update(password).digest('hex') });
      if (Passowrd) {
          return res.status(400).json({ msg: 'Password already exists, choose a different one' });
      }


      // Хешування пароля
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

      // Приклад обробки файлу аватара, якщо він надсилається

      console.log(req.body.avatar)

      // Створення нового користувача
      const newUser = new User({
          name,
          age,
          email,
          password: hashedPassword,
          role,
          avatar, // Буфер аватара
          additionalInfo
      });

      // Збереження користувача в базі даних
      const savedUser = await newUser.save();
      res.status(201).json({ msg: 'User added successfully', status: true, id: savedUser.id , avatar : savedUser.avatar });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

router.post('/avatar', async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findOne({ id: id });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.avatar) {
      // Перетворюємо Buffer у base64 рядок для створення URL
      const base64String = user.avatar;
      const imageUrl = `${base64String}`;

      return res.json({ avatar: imageUrl, status: true });
    } else {
      return res.status(404).json({ msg: 'Avatar not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Базова перевірка даних
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide both email and password' });
    }

    // Знайти користувача за email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Хешувати наданий пароль і порівняти з збереженим хешем
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    if (hashedPassword !== user.password) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Створити JWT токен
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '7d' });

    // Встановити токен у cookie
    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({ msg: 'Login successful', status: true, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.post('/get_user_data', async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findOne({id});
    console.log(user)
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ user, status: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Видалення користувача за ID
router.post('/delete_user', async (req, res) => {
  try {
    const { id } = req.body;

    // Видалення користувача зі списку за його ідентифікатором
    const deletedUser = await User.deleteMany({ id: id });

    if (deletedUser.deletedCount === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ msg: 'User deleted successfully', status: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router;
