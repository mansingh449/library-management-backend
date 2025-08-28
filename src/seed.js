
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import { connectDB, getCollections } from "./db.js";

dotenv.config();

async function run() {
  const { db } = await connectDB();
  const { Books, Authors } = await getCollections();

  // Ensure unique index on isbn
  await Books.createIndex({ isbn: 1 }, { unique: true }).catch(() => {});

  // Clear existing docs for a clean seed
  await Books.deleteMany({});
  await Authors.deleteMany({});

  // Insert authors
  const authors = [
    { _id: new ObjectId(), name: "Isaac Asimov", nationality: "American", birthYear: 1920 },
    { _id: new ObjectId(), name: "Agatha Christie", nationality: "British", birthYear: 1890 },
  ];

  await Authors.insertMany(authors);

  const [asimov, christie] = authors;

  // Insert books (5 across 3+ genres)
  const books = [
    { title: "Foundation", authorId: asimov._id, genre: "Sci-Fi", publicationYear: 1951, isbn: "9780307292063" },
    { title: "I, Robot", authorId: asimov._id, genre: "Sci-Fi", publicationYear: 1950, isbn: "9780307292070" },
    { title: "Murder on the Orient Express", authorId: christie._id, genre: "Mystery", publicationYear: 1934, isbn: "9780007119318" },
    { title: "The Murder of Roger Ackroyd", authorId: christie._id, genre: "Mystery", publicationYear: 1926, isbn: "9780007527533" },
    { title: "Asimov: A Biography", authorId: asimov._id, genre: "Biography", publicationYear: 2002, isbn: "9780385476217" },
  ];

  await Books.insertMany(books);

  console.log("✅ Seed complete.");
  process.exit(0);
}

run().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
});
