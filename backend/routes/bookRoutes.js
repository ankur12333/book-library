import express from "express";
import Book from "../models/Book.js"; // ✅ Corrected import

const router = express.Router();

// ✅ GET all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find(); // Fetch all books from MongoDB
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ GET book by ID (Fix for 404 Error)
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
app.get("/api/books", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const books = await Book.find().skip(skip).limit(limit);
  const totalBooks = await Book.countDocuments();

  res.json({ books, totalBooks });
});
