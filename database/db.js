const sqlite3 = require("sqlite3").verbose();

const initDatabase = () => {
  const db = new sqlite3.Database("./database/database.db", (error) => {
    if (error) console.error(error);

    return db;
  });

  const usersTable = "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, password TEXT);";

  const channelsTable =
    "CREATE TABLE IF NOT EXISTS channels (id INTEGER PRIMARY KEY, name TEXT, owner_id INTEGER, FOREIGN KEY (owner_id) REFERENCES users(id));";

  const messagesTable =
    "CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY, message TEXT, created_at DATETIME, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(id));";

  const messagesChannelsTable =
    "CREATE TABLE IF NOT EXISTS messagesChannels(message_id INTEGER, channel_id INTEGER, FOREIGN KEY (message_id) REFERENCES messages(id), FOREIGN KEY (channel_id) REFERENCES channels(id))";

  db.serialize(() => {
    db.run(usersTable)
      .run(channelsTable)
      .run(messagesTable)
      .run(messagesChannelsTable, (error) => {
        if (error) console.error(error);
      });
  });

  return db;
};

module.exports = initDatabase;
