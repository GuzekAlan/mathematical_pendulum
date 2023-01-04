require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.set('view engine', 'ejs');

// Auth
app.use(cookieParser());

// Database
const db = require('./dbClient');

// REST API
const apiRouter = require('./api');
app.use('/api', apiRouter);

// Client
const clientRouter = require('./client');
app.use(clientRouter);

async function main() {
    await db.connect();
    app.listen(3100, () => {
        console.log('Listen on port 3100');
    });
}

main();
