const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const server = app.listen(8000, () => {
    console.log('Server is running on Port:', 8000)
});
const io = socket(server);

const messages = [];
const users = {};

app.use(express.static(path.join(__dirname, '/client/')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);

    socket.on('join', (userName) => {
        console.log(`Oh, new user ${userName} has joined the chat!`);
        users[socket.id] = userName;

        socket.emit('message', {
            author: "ChatBot",
            content: `<i>Welcome, ${userName}! Enjoy the chat!`,
        });

        socket.broadcast.emit('message', {
            author: "ChatBot",
            content: `<i>${userName} has joined the conversation!`,
        });
    });

    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', () => {
        const userName = users[socket.id];
        if (userName) {
            delete users[socket.id];

            socket.broadcast.emit('message', {
                author: "ChatBot",
                content: `<i>${userName} has left the conversation... :(`,
            });
        }
    });
});