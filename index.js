const express = require("express");
const dotenv = require("dotenv");
const initDatabase = require("./database/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

const db = initDatabase();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


app.post('/user/signup', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [username, email, password],
      function (err) {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Failed to create user profile' });
        } else {
          console.log(`User ${username} created with ID: ${this.lastID}`);
          res.status(201).json({ message: 'User profile created successfully' });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/user/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    db.get(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password],
      (err, row) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Server error' });
        } else if (!row) {
          res.status(401).json({ message: 'Invalid username or password' });
        } else {
          res.status(200).json({ message: 'Login successful', user: row });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});