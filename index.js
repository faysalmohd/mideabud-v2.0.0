require('dotenv').config();
const host = process.env.HOST;
const port = process.env.PORT;
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const mongoose = require('mongoose');
const routes = require('./routes/routes')
const path = require('path')
const savedName = require('./controllers/controllers')

let saved_user = '';

mongoose.connect(process.env.MONGO_CONN_STR, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(fileUpload());
app.use(express.json())
app.use(express.static('public'))
app.use('/', express.static(__dirname));
app.use('/', routes)
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'login.html'))
})

app.get('/home/:username', (req, res) => {
    saved_user = savedName.savedName
    if (saved_user !== '') {
        res.status(200).sendFile(path.join(__dirname, '/home.html'));
    } else {
        res.status(200).sendFile(path.join(__dirname, '/error.html'));
    }
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
    console.log("Database Connected");
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
    console.log(`http://localhost:${port}/`);
})

