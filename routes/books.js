// Create a new router
const express = require("express")
const router = express.Router()

// Make sure db is available
const db = global.db

// List all books
router.get('/list', function(req, res, next) {
  const sqlquery = "SELECT * FROM books";
  db.query(sqlquery, (err, result) => {
    if (err) return next(err);
    res.render("books/list", { books: result });
  });
});

// Search form
router.get('/search', function(req, res) {
  res.render("books/search");
});

// Search results
router.get('/search-results', function (req, res, next) {
  const term = req.query.keyword || "";
  const sql = "SELECT * FROM books WHERE title LIKE ? OR author LIKE ?";
  
  db.query(sql, [`%${term}%`, `%${term}%`], (err, result) => {
    if (err) return next(err);
    res.render("books/search_results", { books: result, term });
  });
});


// Add form
router.get('/add', function(req, res) {
  res.render('books/add');
});

// Add submit
router.post("/add", (req, res) => {
    const { title, author, year } = req.body;

    const sql = "INSERT INTO books (title, author, year) VALUES (?, ?, ?)";
    global.db.query(sql, [title, author, year], (err) => {
        if (err) throw err;

        res.redirect("/books/list");
    });
});
// edit books
router.get('/edit/:id', function (req, res, next) {
  const id = req.params.id;
  const sql = "SELECT * FROM books WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return next(err);
    res.render("books/edit", { book: result[0] });
  });
});
// edit post
router.post('/edit/:id', function (req, res, next) {
  const id = req.params.id;
  const { title, author, year } = req.body;

  const sql = "UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?";
  db.query(sql, [title, author, year, id], (err) => {
    if (err) return next(err);
    res.redirect('/books/list');
  });
});


// Delete book
router.get('/delete/:id', function (req, res, next) {
  const id = req.params.id;
  const sql = "DELETE FROM books WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return next(err);
    res.redirect('/books/list');
  });
});

// add book 
router.post("/add", (req, res) => {
    const { title, author, year } = req.body;

    const sql = "INSERT INTO books (title, author, year) VALUES (?, ?, ?)";
    global.db.query(sql, [title, author, year], (err) => {
        if (err) throw err;

        res.redirect("/books/list");
    });
});

// EDIT form (GET)
router.get('/edit/:id', function (req, res, next) {
  const id = req.params.id;
  const sql = "SELECT * FROM books WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return next(err);
    res.render("books/edit", { book: result[0] });
  });
});

// EDIT submit (POST)
router.post('/edit/:id', function (req, res, next) {
  const id = req.params.id;
  const { title, author, year } = req.body;

  const sql = "UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?";
  db.query(sql, [title, author, year, id], (err) => {
    if (err) return next(err);
    res.redirect('/books/list');
  });
});


// Export router
module.exports = router;
