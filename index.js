const express = require("express");
const { sequelize } = require("./lib");
const { Author } = require("./models/author.model");
const { Genre } = require("./models/genre.model");
const { Book } = require("./models/book.model");
const { where } = require("sequelize");


const app = express();
app.use(express.json());

const authorsData = [
    { name: 'J.K. Rowling', birthdate: '1965-07-31', email: 'jkrowling@books.com' },
    { name: 'George R.R. Martin', birthdate: '1948-09-20', email: 'grrmartin@books.com' }
  ];
  
  const genresData = [
    { name: 'Fantasy', description: 'Magical and mythical stories.' },
    { name: 'Drama', description: 'Fiction with realistic characters and events.' }
  ];
  
  const booksData = [
    { title: 'Harry Potter and the Philosopher\'s Stone', description: 'A young wizard\'s journey begins.', publicationYear: 1997, authorId: 1 },
    { title: 'Game of Thrones', description: 'A medieval fantasy saga.', publicationYear: 1996, authorId: 2 }
  ];
 

  app.get("/seed_db", async (req, res) => {
    try {
        await sequelize.sync({ force: true });

        const authors = await Author.bulkCreate(authorsData);

        const genres = await Genre.bulkCreate(genresData);

        const books = await Book.bulkCreate(booksData)

         // Set up the many-to-many relationship between books and genres
        await books[0].setGenres([genres[0]]);
        await books[1].setGenres([genres[0], genres[1]]);

        return res.status(200).json({ message: "Database seeded successfully!"})

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
  });

  // Get All Books:
  app.get("/books", async (req, res) => {
    try {
        const books = await Book.findAll();
        if (!books) {
            return res.status(404).json({ message: "Books data not found."});
        }
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
  });

  // Fetch All Books Written by an Author:
  async function fetchAllBookByAuthor(authorId) {
    const books = await Book.findAll({
        where: { authorId },
        include: {
            model: Author,
            attributes: ["id", "name", "birthdate", "email"]
        },
        include: {
            model: Genre,
            attributes: ["name", "description"]
        }
    });

    return {books};
  }
  app.get("/authors/:authorId/books", async (req, res) => {
    const authorId = parseInt(req.params.authorId);
    if (!authorId) {
        return res.status(400).json({ message: "Invalid Author Id."})
    }
    try {
        const result = await fetchAllBookByAuthor(authorId);
        if (!result) {
            return res.status(404).json({ message: "Books not found by this author"});
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
  });

  // Get Books by Genre:
  async function fetchBooksByGenre(genreId) {
    const books = await Genre.findAll({ 
        where: { id: genreId },
        include: [
            {
                model: Book,
                include: [
                    {
                        model: Author,
                        attributes: ["id", "name", "email"]
                    }
                ]
            }
        ]
    });
    return {books};
  }
  app.get("/genres/:genreId/books", async (req, res) => {
    const genreId = req.params.genreId;
    if (!genreId) {
        return res.status(400).json({ message: "Invalid Genre."})
    }
    try {
        const result = await fetchBooksByGenre(genreId);
        if (!result) {
            return res.status(404).json({ message: "Books not found by this genre"});
        }
        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
  });

  // Add a New Book:
  async function addNewBook(bookData) {
    const newBook = await Book.create(bookData);
    return { newBook };
  }
  app.post("/books", async (req, res) => {
    const { title, description, publicationYear, authorId } = req.body;
    // validate input data
    if (!title || !description || !publicationYear || !authorId) {
        return res.status(400).json({ message: "Data is Invalid"})
    }
    try {
        const result = await addNewBook({ title, description, publicationYear, authorId});
        if (!result) {
            return res.status(404).json({ message: "Books not created."});
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
  })


const port = 3000;
app.listen(port, () => {
    console.log("Server is running at port: ", port);
});
