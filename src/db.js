
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = 'mongodb+srv://shubh:test123@cluster0.k452qem.mongodb.net/demo';
if (!uri) {
  throw new Error("MONGO_URI is not defined in environment variables.");
}

let client;
let clientPromise;
let db;

export async function connectDB() {
  if (db) return { client, db };

  if (!clientPromise) {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
    clientPromise = client.connect();
  }
  await clientPromise;
  db = client.db(); // default DB from connection string, or specify: client.db("librarydb")
  return { client, db };
}

export async function getCollections() {
  const { db } = await connectDB();
  return {
    Books: db.collection("books"),
    Authors: db.collection("authors"),
  };
}
