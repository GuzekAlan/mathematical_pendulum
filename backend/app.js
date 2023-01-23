require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(cors());

app.use('/assets', express.static(path.join(__dirname, '../frontend')));


const PORT = process.env.PORT || 11934
// Database
const db = require('./dbClient');

// REST API
const apiRouter = require('./api');
app.use('/api', apiRouter);

// Client
const clientRouter = require('./client');
const {static} = require("express");
const {resolve} = require("path");
app.use(clientRouter);

async function main() {
    await db.connect();
    app.listen(3300, () => {
        console.log('Listen on port 3300');
    });
}

main();
