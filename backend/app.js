require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(cors());

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
    app.listen(3200, () => {
        console.log('Listen on port 3200');
    });
}

main();
