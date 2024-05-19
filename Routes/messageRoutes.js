const express = require("express");
const router = express.Router();
const initDatabase = require("../database/db");

const db = initDatabase();

router
  .get("/", async (req, res) => {
    // /api/messages/
    try {
      db.all("SELECT * FROM messages", (err, rows) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Failed to retrieve messages" });
        } else {
          res.status(200).json(rows);
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  })
  .post("/create", async (req, res) => {
    // /api/messages/create
    try {
      const { message, userId, channelIds } = req.body;
      const curentdate = new Date();

      // Check which channels the user is subscribed to
      db.all(
        `SELECT channel_id FROM usersChannels WHERE user_id = ? AND channel_id IN (${channelIds
          .map(() => "?")
          .join(",")})`,
        [userId, ...channelIds],
        (err, rows) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to verify channel subscriptions" });
          }

          // Map over subscribed channels into a variable
          const subscribedChannelIds = rows.map((row) => row.channel_id);

          // If the user isn't subscribed to any of the channels, return with an error
          if (subscribedChannelIds.length === 0) {
            return res.status(400).json({ message: "User is not subscribed to any of the specified channels" });
          }

          // Insert message to messages table
          db.run(
            "INSERT INTO messages (message, user_id, created_at) VALUES (?, ?, ?)",
            [message, userId, curentdate],
            function (err) {
              if (err) {
                console.error(err);
                res.status(500).json({ message: "Failed to create message" });
              } else {
                const messageId = this.lastID;

                // Insert message and channel id to messagesChannels table, one entry for each channel
                subscribedChannelIds.forEach((channelId) => {
                  db.run(
                    "INSERT INTO messagesChannels (message_id, channel_id) VALUES (?, ?)",
                    [messageId, channelId],
                    function (err) {
                      if (err) {
                        console.error(err);
                        res.status(500).json({
                          message: "Failed to associate message with channel",
                        });
                      }
                    }
                  );
                });
                res.status(201).json({ message: "Message created successfully" });
              }
            }
          );
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
