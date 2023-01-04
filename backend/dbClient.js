const {MongoClient} = require('mongodb');
const db = new MongoClient(process.env.DATABASE_URI);

module.exports = db;


