const express = require("express");
const router = express.Router();
const initDatabase = require("../database/db");

const db = initDatabase();

router
  .post("/:channelId/subscribe", async (req, res) => {
    // /api/channel/:channelId/subscribe
    try {
      const channelId = req.params.channelId;
      const { userId } = req.body;

      db.run("INSERT INTO usersChannels (user_id, channel_id) VALUES (?, ?)", [userId, channelId], function (err) {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Failed" });
        } else {
          res.status(201).json({ message: "success" });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  })
  .get("/:channelId/messages", async (req, res) => {
    // /api/channel/:channelId/messages
    const channelId = req.params.channelId;
    try {
      db.all(
        "SELECT messages.* FROM messages JOIN messagesChannels ON messages.id = messagesChannels.message_id WHERE messagesChannels.channel_id = ?",
        [channelId],
        (err, rows) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to retrieve messages" });
          } else {
            console.log(rows);
            res.status(200).json(rows);
          }
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  })
  .post("/create", async (req, res) => {
    // /api/channel/create
    try {
      const { name, ownerId } = req.body;

      db.run("INSERT INTO channels (name, owner_id) VALUES (?, ?)", [name, ownerId], function (err) {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Failed to create channel" });
        } else {
          console.log(`Channel ${name} created with ID: ${this.lastID}`);
          res.status(201).json({ message: "Channel created successfully" });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
