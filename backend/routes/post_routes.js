const express = require("express");
const postRouter = express.Router();

// Import the getPosts function from your controller
const { getPosts } = require("../controllers/post_contoller");
const { authenticateToken } = require("../controllers/user_controller");

// Define the route handler for the GET request
postRouter.get("/getPosts", authenticateToken, getPosts);

module.exports = postRouter;
