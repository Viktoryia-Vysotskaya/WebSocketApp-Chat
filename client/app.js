{
    "use strict";

    const socket = io();

    // References to HTML elements
    const loginForm = document.querySelector('#welcome-form');
    const messagesSection = document.querySelector('#messages-section');
    const messagesList = document.querySelector('#messages-list');
    const addMessageForm = document.querySelector('#add-messages-form');
    const userNameInput = document.querySelector('#username');
    const messageContentInput = document.querySelector('#message-content');

    let userName = ''; // Global variables

    socket.on('message', ({ author, content }) => addMessage(author, content));

    const login = (e) => {
        e.preventDefault();
        if (!userNameInput.value) {
            alert('Please, enter a username!');
        } else {
            userName = userNameInput.value;
            loginForm.classList.remove('show');
            messagesSection.classList.add('show');
        }
    };

    const addMessage = (author, content) => {
        const message = document.createElement('li');
        message.classList.add('message');
        message.classList.add('message--received');
        if (author === userName) message.classList.add('message--self');
        message.innerHTML = `
          <h3 class="message__author">${userName === author ? 'You' : author}</h3>
          <div class="message__content">
            ${content}
          </div>
        `;
        messagesList.appendChild(message);
    }

    const sendMessage = (e) => {
        e.preventDefault();
        let messageContent = messageContentInput.value;
        if (!messageContentInput.value) {
            alert('Please, enter a message!');
        } else {
            addMessage(userName, messageContent);
            socket.emit('message', { author: userName, content: messageContent });
            messageContentInput.value = '';
        }
    };

    // Event listeners
    loginForm.addEventListener("submit", (e) => login(e));
    addMessageForm.addEventListener("submit", (e) => sendMessage(e));

}