
import dotenv from "dotenv";
import { connectDB, getCollections } from "./db.js";

dotenv.config();

async function run() {
  const { Books } = await getCollections();
  await Books.createIndex({ isbn: 1 }, { unique: true });
  console.log("✅ Index created: { isbn: 1 } unique");
  process.exit(0);
}

run().catch((e) => {
  console.error("Index error:", e);
  process.exit(1);
});
