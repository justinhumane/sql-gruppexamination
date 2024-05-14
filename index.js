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
