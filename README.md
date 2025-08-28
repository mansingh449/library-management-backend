
# Library Management System – Backend (Apollo Server 4 + MongoDB Native)

## Prerequisites
- Node.js 18+
- A running MongoDB instance or MongoDB Atlas connection string

## Setup
1. Copy `.env.sample` to `.env` and fill in your MongoDB connection string:
   ```bash
   cp .env.sample .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create indexes (unique ISBN):
   ```bash
   npm run create-indexes
   ```

4. Seed initial data:
   ```bash
   npm run seed
   ```

5. Start the server:
   ```bash
   npm start
   ```

## Environment Variables
- `MONGO_URI` – MongoDB connection string (e.g., `mongodb+srv://<user>:<pass>@cluster/db?retryWrites=true&w=majority`)
- `PORT` – Port for the GraphQL server (default: 4000)

## GraphQL
- Endpoint: `http://localhost:4000/graphql`
- Example Queries:

```
query GetAllBooks {
  getAllBooks {
    id
    title
    author {
      id
      name
    }
  }
}

query GetBookDetails($id: ID!) {
  getBookDetails(id: $id) {
    id
    title
    author {
      id
      name
      nationality
      birthYear
    }
    genre
    publicationYear
    isbn
  }
}

query GetBooksByGenre($genre: String!) {
  getBooksByGenre(genre: $genre) {
    id
    title
    author { name }
  }
}

mutation AddBook($inputTitle: String!, $inputAuthor: ID!, $genre: String!, $year: Int!, $isbn: String!) {
  addBook(title: $inputTitle, author: $inputAuthor, genre: $genre, publicationYear: $year, isbn: $isbn) {
    id
    title
    isbn
  }
}
```
