import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, default: "Unknown" },
  cover: { type: String, default: "/default-cover.jpg" },
  file: { type: String, required: true },
});

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
