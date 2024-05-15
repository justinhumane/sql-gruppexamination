const express = require("express");
const dotenv = require("dotenv");
const initDatabase = require("./database/db");
const channelRoutes = require("./Routes/channelRoutes");
const userRoutes = require("./Routes/userRoutes");
const messageRoutes = require("./Routes/messageRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

const db = initDatabase();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.use("/api/channel", channelRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);
