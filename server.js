const express = require("express");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const dbFile = path.join(__dirname, "Lucasdb.json");

// Lire la base de données
function readDB() {
  return JSON.parse(fs.readFileSync(dbFile, "utf8"));
}

// Écrire dans la base de données
function writeDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// Purger la base de données
function purgeDB() {
  const db = {
    users: [],
    messages: [],
  };
  writeDB(db);
}

let connectedUsers = new Set();

// Servir le fichier index.html spécifique en premier
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "App Academique"));
});

// Servir les autres fichiers statiques du répertoire public

app.use(express.static(path.join(__dirname, "App Academique")));

io.on("connection", function (socket) {
  socket.on("newuser", function ({ username, password }) {
    const db = readDB();

    if (connectedUsers.has(username)) {
      socket.emit(
        "username-taken",
        "Ce nom d'utilisateur est en cours d'utilisation"
      );
      return;
    }

    if (password !== process.env.MOT_DE_PASSE) {
      socket.emit("auth-error", "Mot de passe incorrect");
      return;
    }

    if (db.users.length > 5000 || db.messages.length > 5000) {
      purgeDB();
    }

    if (!db.users.includes(username)) {
      db.users.push(username);
    }

    writeDB(db);

    connectedUsers.add(username);
    socket.username = username;

    socket.emit("auth-success");
    socket.broadcast.emit(
      "update",
      `<p class="signal">${username} est actuellement connecté(e)</p>`
    );

    // Envoyer l'historique des messages à l'utilisateur nouvellement connecté
    socket.emit("load-messages", db.messages);
  });

  socket.on("exituser", function (username) {
    connectedUsers.delete(username);
    const db = readDB();
    db.users = db.users.filter((user) => user !== username);
    writeDB(db);

    socket.broadcast.emit(
      "update",
      `<p class="signal">${username} s'est déconnecté(e)</p>`
    );
  });

  socket.on("disconnect", function () {
    if (socket.username) {
      connectedUsers.delete(socket.username);
    }
  });

  socket.on("chat", function (message) {
    const db = readDB();
    db.messages.push(message);
    writeDB(db);

    socket.broadcast.emit("chat", message);
  });

  socket.on("delete-message", function (messageId) {
    const db = readDB();
    const messageIndex = db.messages.findIndex((msg) => msg.id === messageId);

    if (
      messageIndex !== -1 &&
      db.messages[messageIndex].username === socket.username
    ) {
      db.messages.splice(messageIndex, 1);
      writeDB(db);
      io.emit("delete-message", messageId);
    }
  });

  socket.on("edit-message", function ({ messageId, newText }) {
    const db = readDB();
    const message = db.messages.find((msg) => msg.id === messageId);

    if (message && message.username === socket.username) {
      message.text = newText;
      writeDB(db);
      io.emit("edit-message", { messageId, newText });
    }
  });
});

server.listen(5000, () => {
  console.log(`Le serveur marche au port masqué !`);
});
