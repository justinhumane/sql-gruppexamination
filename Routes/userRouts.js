app.delete("/user/delete", async (req, res) => {
  try {
    const { id } = req.body;

    db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete user profile" });
      } else if (this.changes === 0) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json({ message: "User profile deleted successfully" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/user/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [username, email, password],
      function (err) {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Failed to create user profile" });
        } else {
          console.log(`User ${username} created with ID: ${this.lastID}`);
          res
            .status(201)
            .json({ message: "User profile created successfully" });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
