require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, '../frontend')));

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
    app.listen(3300, () => {
        console.log('Listen on port 3300');
    });
}

main();
