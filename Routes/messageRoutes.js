app.get("/messages", async (req, res) => {
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
});

app.post("/message/create", async (req, res) => {
  try {
    const { message, userId, channelIds } = req.body;
    const curentdate = new Date();

    db.run(
      "INSERT INTO messages (message, user_id, created_at) VALUES (?, ?, ?)",
      [message, userId, curentdate],
      function (err) {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Failed to create message" });
        } else {
          const messageId = this.lastID;

          channelIds.forEach((channelId) => {
            db.run(
              "INSERT INTO messagesChannels (message_id, channel_id) VALUES (?, ?)",
              [messageId, channelId],
              function (err) {
                if (err) {
                  console.error(err);
                  res.status(500).json({
                    message: "Failed to associate message with channel",
                  });
                } else {
                  console.log(
                    `Message ${messageId} created in channel ${channelId}`
                  );
                }
              }
            );
          });
          res.status(201).json({ message: "Message created successfully" });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
