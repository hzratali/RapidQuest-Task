import { MongoClient } from "mongodb";

let db;

const connectDB = async () => {
  if (db) return db;

  try {
    const client = new MongoClient(process.env.MONGODB_URI);

    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("RQ_Analytics");
    return db;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
};

export default connectDB;
