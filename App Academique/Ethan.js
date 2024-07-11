(function () {
  const app = document.querySelector(".app");
  const socket = io();

  let uname;
  let editMessageId = null; // Store the ID of the message being edited
  let replyToMessageId = null; // Store the ID of the message being replied to

  app
    .querySelector(".join-screen #join-user")
    .addEventListener("click", function () {
      let username = app.querySelector(".join-screen #username").value;
      let password = app.querySelector(".join-screen #password").value;
      if (username.length == 0 || password.length == 0) {
        return;
      }
      socket.emit("newuser", { username, password });
    });

  socket.on("username-taken", function (message) {
    alert(message);
  });

  socket.on("auth-error", function (message) {
    alert(message);
  });

  socket.on("auth-success", function () {
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
    uname = app.querySelector(".join-screen #username").value;
  });

  socket.on("load-messages", function (messages) {
    messages.forEach((message) => {
      renderMessage(message.username === uname ? "my" : "other", message);
    });
  });

  socket.on("update", function (message) {
    renderMessage("update", message);
  });

  app
    .querySelector(".chat-screen #send-message")
    .addEventListener("click", function () {
      let messageText = app.querySelector(".chat-screen #message-input").value;
      if (messageText.length == 0) {
        return;
      }

      if (editMessageId) {
        socket.emit("edit-message", {
          messageId: editMessageId,
          newText: messageText,
        });
        editMessageId = null; // Reset editMessageId
      } else {
        const message = {
          id: Date.now(), // Unique ID for each message
          username: uname,
          text: messageText,
          replyTo: replyToMessageId,
        };
        renderMessage("my", message);
        socket.emit("chat", message);
      }

      app.querySelector(".chat-screen #message-input").value = "";
      replyToMessageId = null; // Reset replyToMessageId after sending the message
    });

  app
    .querySelector(".chat-screen #exit-chat")
    .addEventListener("click", function () {
      socket.emit("exituser", uname);
      window.location.href = window.location.href;
    });

  socket.on("chat", function (message) {
    renderMessage("other", message);
  });

  socket.on("delete-message", function (messageId) {
    const messageElement = document.querySelector(
      `.message[data-id="${messageId}"]`
    );
    if (messageElement) {
      messageElement.remove();
    }
  });

  socket.on("edit-message", function ({ messageId, newText }) {
    const messageElement = document.querySelector(
      `.message[data-id="${messageId}"] .text`
    );
    if (messageElement) {
      messageElement.textContent = newText;
    }
  });

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    let el = document.createElement("div");
    el.setAttribute("class", `message ${type}-message`);
    el.setAttribute("data-id", message.id);
    let replyToText = "";
    if (message.replyTo) {
      const replyToMessage = document.querySelector(
        `.message[data-id="${message.replyTo}"] .text`
      );
      const replyToUsername = document.querySelector(
        `.message[data-id="${message.replyTo}"] .name`
      ).textContent;
      if (replyToMessage) {
        replyToText = `<div class="reply-to-text">${replyToUsername}: ${replyToMessage.textContent}</div>`;
      }
    }
    if (type === "my") {
      el.innerHTML = `
        <div>
          <div class="name">Vous</div>
          ${replyToText}
          <div class="text">${message.text}</div>
          <button class="edit-btn">Modifier</button>
          <button class="delete-btn">Supprimer</button>
          <button class="reply-btn">Répondre</button>
        </div>`;
    } else if (type === "other") {
      el.innerHTML = `
        <div>
          <div class="name">${message.username}</div>
          ${replyToText}
          <div class="text">${message.text}</div>
          <button class="reply-btn">Répondre</button>
        </div>`;
    } else if (type === "update") {
      el.setAttribute("class", "update");
      el.innerHTML = message;
    }
    messageContainer.appendChild(el);

    // Ajouter un gestionnaire d'événements pour le clic droit sur les messages de l'utilisateur
    if (type === "my" || type === "other") {
      el.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        const editBtn = el.querySelector(".edit-btn");
        const deleteBtn = el.querySelector(".delete-btn");
        const replyBtn = el.querySelector(".reply-btn");
        if (editBtn) editBtn.classList.add("show");
        if (deleteBtn) deleteBtn.classList.add("show");
        replyBtn.classList.add("show");
      });

      if (type === "my") {
        el.querySelector(".edit-btn").addEventListener("click", function () {
          const messageText = el.querySelector(".text").textContent;
          app.querySelector(".chat-screen #message-input").value = messageText;
          editMessageId = message.id; // Set the editMessageId to the message being edited
        });

        el.querySelector(".delete-btn").addEventListener("click", function () {
          if (confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
            socket.emit("delete-message", message.id);
          }
        });
      }

      el.querySelector(".reply-btn").addEventListener("click", function () {
        replyToMessageId = message.id; // Set the replyToMessageId to the message being replied to
        // Clear the input field for a personalized reply
        app.querySelector(".chat-screen #message-input").value = "";
        // Focus the message input to show the blinking cursor
        app.querySelector(".chat-screen #message-input").focus();
      });
    }

    // Cacher les boutons Modifier, Supprimer et Répondre lorsqu'on clique ailleurs
    document.addEventListener("click", function (e) {
      if (!el.contains(e.target)) {
        const editBtn = el.querySelector(".edit-btn");
        const deleteBtn = el.querySelector(".delete-btn");
        const replyBtn = el.querySelector(".reply-btn");
        if (editBtn) editBtn.classList.remove("show");
        if (deleteBtn) deleteBtn.classList.remove("show");
        replyBtn.classList.remove("show");
      }
    });

    // Scroll chat to end
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }
})();
