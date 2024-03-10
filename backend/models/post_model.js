const mongoose = require("mongoose");

// Define schema for the post
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  href: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  datetime: { type: String, required: true },
  category: {
    title: { type: String, required: true },
    href: { type: String, required: true },
  },
  author: {
    name: { type: String, required: true },
    role: { type: String, required: true },
    href: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
});

// Create the model
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
