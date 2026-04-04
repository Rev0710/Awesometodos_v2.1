const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const dbName = "Awesometodos_v2_1";

let db;

async function connectDB() {
  if (db) return db;

  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");

    db = client.db(dbName);
    return db;
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
}

module.exports = { connectDB };