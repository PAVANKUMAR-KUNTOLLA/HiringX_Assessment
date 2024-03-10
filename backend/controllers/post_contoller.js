const Post = require("../models/post_model");
const User = require("../models/user_model");

const getPosts = async (req, res, next) => {
  try {
    const offset = parseInt(req.query.offset) || 0; // Default offset is 0
    const limit = parseInt(req.query.limit) || 9; // Default limit is 9

    // Fetch posts based on offset and limit
    const posts = await Post.find().skip(offset).limit(limit);

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

module.exports = {
  getPosts,
};
