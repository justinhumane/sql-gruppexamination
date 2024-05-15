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


app.delete('/user/delete', async (req, res) => {
  try {
    const { id } = req.body;
    
    db.run(
      'DELETE FROM users WHERE id = ?',
      [id],
      function (err) {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Failed to delete user profile' });
        } else if (this.changes === 0) {
          res.status(404).json({ message: 'User not found' });
        } else {
          res.status(200).json({ message: 'User profile deleted successfully' });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/channel/create', async (req, res) => {
  try {
    const { name, ownerId } = req.body;

    db.run(
      'INSERT INTO channels (name, owner_id) VALUES (?, ?)',
      [name, ownerId],
      function (err) {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Failed to create channel' });
        } else {
          console.log(`Channel ${name} created with ID: ${this.lastID}`);
          res.status(201).json({ message: 'Channel created successfully' });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/channel/:channelId/message/create', async (req, res) => {
  try {
    const { message, userId } = req.body;
    const channelId = req.params.channelId;

    
    db.run(
      'INSERT INTO messages (message, user_id) VALUES (?, ?)',
      [message, userId],
      function (err) {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Failed to create message' });
        } else {
          const messageId = this.lastID;

        
          db.run(
            'INSERT INTO messagesChannels (message_id, channel_id) VALUES (?, ?)',
            [messageId, channelId],
            function (err) {
              if (err) {
                console.error(err);
                res.status(500).json({ message: 'Failed to associate message with channel' });
              } else {
                console.log(`Message ${messageId} created in channel ${channelId}`);
                res.status(201).json({ message: 'Message created successfully' });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});