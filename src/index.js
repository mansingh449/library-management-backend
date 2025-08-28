
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./schema.js";
import { connectDB } from "./db.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError(formattedError) {
    // Normalize error messages
    return {
      message: formattedError.message,
      path: formattedError.path,
      locations: formattedError.locations,
      extensions: formattedError.extensions,
    };
  },
});

await server.start();

// Ensure DB connects at startup
await connectDB();

app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async () => ({}),
  })
);

app.get("/", (_, res) => {
  res.json({ status: "ok", graphql: "/graphql" });
});

app.listen(PORT, () => {
  console.log(`🚀 GraphQL server running at http://localhost:${PORT}/graphql`);
});
