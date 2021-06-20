//
// ─── REQUIREMENTS ───────────────────────────────────────────────────────────────
//
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Mongoose = require('mongoose');
const Initializer = require('./Initializer');
const ApplicationInitializeInfo = require('./ApplicationInitializeInfo');

const authRoutes = require('./Routes/auth');

const errorController = require('./Controllers/error');
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── INITIALIZE ─────────────────────────────────────────────────────────────────
//
Mongoose.set('useFindAndModify', false);
Mongoose.set('useNewUrlParser', true);
Mongoose.set('useUnifiedTopology', true);
Mongoose.set('useCreateIndex', true);

const app = express();
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization');
    next();
});
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── ROUTES ─────────────────────────────────────────────────────────────────────
//
app.use('/auth', authRoutes);

app.use(errorController.get404);
app.use((error, req, res, next) => {
    errorController.get500(req, res, next, error);
});
// ────────────────────────────────────────────────────────────────────────────────


//
// ─── LISTEN ─────────────────────────────────────────────────────────────────────
//
Mongoose
    .connect(ApplicationInitializeInfo.DB_URI)
    .then(() => {
        new Initializer();
        const server = require('http').createServer(app);
        console.log('Base API Online.');

        server.listen(ApplicationInitializeInfo.PORT);
    })
    .catch(error => console.log(error));
// ────────────────────────────────────────────────────────────────────────────────