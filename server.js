const express = require('express');
const path = require('path');

const app = express();

const messages = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
    res.render('index.html');
});

app.use((req, res) => {
    res.status(404).send('404 not found...');
})

const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});
