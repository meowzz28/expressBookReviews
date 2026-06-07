const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist 
        if (!isValid(username)) { 
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user. Username and/or password missing."});
  });

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        // Simulating an asynchronous operation using a Promise
        const getBooks = new Promise((resolve, reject) => {
            resolve(books);
        });

        // Await the resolution of the Promise
        const bookList = await getBooks;
        return res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        // Simulating an asynchronous operation using a Promise
        const getBook = new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject(new Error("Book not found"));
            }
        });

        // Await the resolution of the Promise
        const bookDetails = await getBook;
        return res.status(200).send(JSON.stringify(bookDetails, null, 4));

    } catch (error) {
        // Catch the rejection from the Promise and return a 404 status
        return res.status(404).json({ message: error.message });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        // Simulating an asynchronous operation using a Promise
        const getBooksByAuthor = new Promise((resolve, reject) => {
            const isbns = Object.keys(books);
            let matchingBooks = [];

            isbns.forEach((isbn) => {
                if (books[isbn].author === author) {
                    matchingBooks.push({
                        isbn: isbn,
                        title: books[isbn].title,
                        reviews: books[isbn].reviews
                    });
                }
            });

            if (matchingBooks.length > 0) {
                resolve({ booksbyauthor: matchingBooks });
            } else {
                reject(new Error("No books found by this author"));
            }
        });

        // Await the resolution of the Promise
        const authorBooks = await getBooksByAuthor;
        return res.status(200).send(JSON.stringify(authorBooks, null, 4));

    } catch (error) {
        // Catch the rejection from the Promise and return a 404 status
        return res.status(404).json({ message: error.message });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        // Simulating an asynchronous operation using a Promise
        const getBooksByTitle = new Promise((resolve, reject) => {
            const isbns = Object.keys(books);
            let matchingBooks = [];

            isbns.forEach((isbn) => {
                if (books[isbn].title === title) {
                    matchingBooks.push({
                        isbn: isbn,
                        author: books[isbn].author,
                        reviews: books[isbn].reviews
                    });
                }
            });

            if (matchingBooks.length > 0) {
                resolve({ booksbytitle: matchingBooks });
            } else {
                reject(new Error("No books found with this title"));
            }
        });

        // Await the resolution of the Promise
        const titleBooks = await getBooksByTitle;
        return res.status(200).send(JSON.stringify(titleBooks, null, 4));

    } catch (error) {
        // Catch the rejection from the Promise and return a 404 status
        return res.status(404).json({ message: error.message });
    }
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;
    
    // Check if the book exists in the database
    if (books[isbn]) {
        // Extract and return just the reviews for that specific book
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        // Return a 404 error if the book is not found
        return res.status(404).json({ message: "Book not found" });
    }
  });

module.exports.general = public_users;
