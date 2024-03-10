const express = require("express");
const userRouter = express.Router();

// Import the signUp function from your controller
const {
  signUp,
  userVerify,
  signIn,
  forgotPassword,
  resetPassword,
  getUserProfile,
} = require("../controllers/user_controller");

// Import the upload middleware
const upload = require("../middleware/photo_upload");

// Define the route handler for the POST request
userRouter.post("/signup", upload, signUp);
userRouter.post("/verify", userVerify);
userRouter.post("/login", signIn);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/profile", getUserProfile);

module.exports = userRouter;
