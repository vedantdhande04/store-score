const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { name, email, password, address } = req.body;


  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }

  try {
   
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, role',
      [name, email, hashedPassword, address, 'Normal User']
    );

    const token = jwt.sign(
        { id: newUser.rows[0].id, role: newUser.rows[0].role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );


    res.status(201).json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {

    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {

      return res.status(401).json({ message: 'Invalid credentials' });
    }


    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    const token = jwt.sign(
        { id: user.rows[0].id, role: user.rows[0].role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(200).json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};