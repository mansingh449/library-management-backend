
import { gql } from "graphql-tag";
import { ObjectId } from "mongodb";
import { getCollections } from "./db.js";

export const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: Author!
    genre: String!
    publicationYear: Int!
    isbn: String!
  }

  type Author {
    id: ID!
    name: String!
    nationality: String
    birthYear: Int
  }

  type Query {
    getAllBooks: [Book!]!
    getBookDetails(id: ID!): Book
    getBooksByGenre(genre: String!): [Book!]!
  }

  type Mutation {
    addBook(title: String!, author: ID!, genre: String!, publicationYear: Int!, isbn: String!): Book!
  }
`;

export const resolvers = {
  Book: {
    author: async (parent) => {
      const { Authors } = await getCollections();
      const author = await Authors.findOne({ _id: new ObjectId(parent.authorId) });
      if (!author) throw new Error("Author not found for this book");
      return {
        id: author._id.toString(),
        name: author.name,
        nationality: author.nationality,
        birthYear: author.birthYear,
      };
    },
    id: (parent) => parent._id ? parent._id.toString() : parent.id,
  },

  Author: {
    id: (parent) => parent._id ? parent._id.toString() : parent.id,
  },

  Query: {
    getAllBooks: async () => {
      const { Books } = await getCollections();
      return Books.find({}).sort({ title: 1 }).toArray();
    },
    getBookDetails: async (_, { id }) => {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
      const { Books } = await getCollections();
      const book = await Books.findOne({ _id: new ObjectId(id) });
      if (!book) throw new Error("Book not found");
      return book;
    },
    getBooksByGenre: async (_, { genre }) => {
      const { Books } = await getCollections();
      return Books.find({ genre }).sort({ title: 1 }).toArray();
    },
  },

  Mutation: {
    addBook: async (_, { title, author, genre, publicationYear, isbn }) => {
      if (!ObjectId.isValid(author)) {
        throw new Error("Invalid Author ID");
      }
      // Basic validations
      const year = Number(publicationYear);
      if (Number.isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
        throw new Error("publicationYear must be between 1900 and current year");
      }
      if (!/^\d{13}$/.test(isbn)) {
        throw new Error("ISBN must be 13 digits");
      }

      const { Books, Authors } = await getCollections();
      const authorExists = await Authors.findOne({ _id: new ObjectId(author) });
      if (!authorExists) {
        throw new Error("Author does not exist");
      }

      try {
        const res = await Books.insertOne({
          title,
          authorId: new ObjectId(author),
          genre,
          publicationYear: year,
          isbn,
        });
        const created = await Books.findOne({ _id: res.insertedId });
        return created;
      } catch (err) {
        if (err && err.code === 11000) {
          throw new Error("Duplicate ISBN. A book with this ISBN already exists.");
        }
        throw err;
      }
    },
  },
};
