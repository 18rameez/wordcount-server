const { MongoClient } = require("mongodb");
require('dotenv').config();

const db_url = process.env.DB_URL;
let _db;

function createDBConnection(callback) {
  MongoClient.connect(db_url)
    .then((client) => {
      _db = client.db();
      callback();
    })
    .catch((err) => {
      throw err;
    });
}

function getDB() {
  if (_db) {
    return _db;
  } else {
    throw new Error("No DB found");
  }
}

exports.createDBConnection = createDBConnection;
exports.getDB = getDB;
