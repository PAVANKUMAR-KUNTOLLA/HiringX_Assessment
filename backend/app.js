const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS for local host
app.use(cors({}));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

//import routes
const userRouter = require("./routes/user_routes");
const postRouter = require("./routes/post_routes");

app.use("/api/v1", userRouter);
app.use("/api/v1", postRouter);

app.use('/public', express.static(path.join(__dirname, 'public')));

mongoose
  .connect(process.env.DATABASE_CREDENTIALS)
  .then(() => app.listen(8080))
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log("Error:", err));
