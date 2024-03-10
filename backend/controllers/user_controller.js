const User = require("../models/user_model");
const VerificationToken = require("../models/token_verification");
const sendEmail = require("../mail/send_mail");
const axios = require("axios");

const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

// Function to generate a random token
const generateToken = () => {
  return (
    Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
  );
};

const signUp = async (req, res, next) => {
  const { email, password,username, confirmpassword } = req.body;

  // Check if email and password are provided
  if (!email || !password || !confirmpassword) {
    return res.status(400).json({
      message: "Email, password, and confirm password are required.",
    });
  }

  // Validate email format
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  // Check if password and confirmpassword match
  if (password !== confirmpassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log("error", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists! Please log in." });
  }

  const hashedPassword = bcrypt.hashSync(password);

  // Initialize profile picture variable
  let profilePicture = '';

  // Check if a file is uploaded
  if (req.file) {
    // If file is uploaded, set profile picture path
    profilePicture = req.file.path;
  }

  // Create a new user
  const user = new User({
    email,
    password: hashedPassword,
    profilePicture: profilePicture, // Assign the profile picture path
    name: username || ""
  });

  try {
    await user.save();
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Failed to create user." });
  }

  // Generate and save verification token using user._id
  const token = generateToken(); // Generate token
  const verificationToken = new VerificationToken({
    userId: user._id, // Reference to the user
    token: token, // Save the generated token
  });

  try {
    await verificationToken.save(); // Save verification token
    // Send email with verification link

    const verificationLink = `${process.env.CLIENT_URL}/verify-email/${email}/${verificationToken.token}`;
    await sendEmail(
      email,
      "Please verify your email and sign up",
      verificationLink
    );
  } catch (err) {
    console.error("Error:", err);
    return res
      .status(500)
      .json({ message: "Failed to create verification token." });
  }

  return res.status(201).json({ user });
};

const userVerify = async (req, res, next) => {
  const { email,token } = req.body;

  // Check if token is provided
  if (!token) {
    return res.status(400).json({ message: "Token is required." });
  }

  // Find verification token in the database
  const verificationUserToken = await VerificationToken.findOne({
    token,
  });

  if (!verificationUserToken) {
    // If verification token is not found, check if user exists with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User with provided email does not exist." });
    }

    // If user exists but is already verified, return appropriate message
    if (user.is_verified) {
      return res.status(400).json({ message: "User is already verified." });
    }

    // Otherwise, return invalid verification token message
    return res.status(400).json({ message: "Invalid verification token." });
  }

  try {
    // Fetch the user based on the user_id associated with the verification token
    const existingUser = await User.findById(verificationUserToken.userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Mark user as verified
    existingUser.is_verified = true;

    // Save the updated user
    await existingUser.save();

    //delete token after verification
    await VerificationToken.findOneAndDelete({ token });


    return res.status(200).json({ message: "User verified successfully." });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Failed to verify user." });
  }
};


const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  if (!existingUser) {
    return res
      .status(400)
      .json({ message: "User does not exist! Please sign up." });
  }

  // Check if the user is verified
  if (!existingUser.is_verified) {
    return res
      .status(401)
      .json({ message: "Email not verified. Please verify your email." });
  }

  const passwordVerified = bcrypt.compareSync(password, existingUser.password);
  if (!passwordVerified) {
    return res.status(401).json({ message: "Incorrect password." });
  }

  try {
    const accessToken = jwt.sign(
      { userId: existingUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    return res
      .status(200)
      .json({ accessToken, message: "Successfully logged in." });
  } catch (err) {
    console.error("Error:", err);
    return res
      .status(500)
      .json({ message: "Failed to generate access token." });
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ message: "email is required." });
  }

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  if (!existingUser) {
    return res
      .status(400)
      .json({ message: "User does not exist! Please sign up." });
  }

  if (!existingUser.is_verified) {
    return res.status(400).json({ message: "Please verify user" });
  }

  try {
    let verificationToken = await VerificationToken.findOne({
      userId: existingUser._id,
    });

    // If a verification token already exists for the user, update it
    if (verificationToken) {
      const token = generateToken(); // Generate new token
      verificationToken.token = token; // Update token
      await verificationToken.save(); // Save updated token
    } else {
      // Generate new token and save it
      const token = generateToken();
      verificationToken = new VerificationToken({
        userId: existingUser._id,
        token: token,
      });
      await verificationToken.save();
    }

    // Send email with verification link
    const verificationLink = `${process.env.CLIENT_URL}/reset-password/${email}/${verificationToken.token}`;
    await sendEmail(email, "Please reset your password", verificationLink);

    // Respond with success message
    return res
      .status(200)
      .json({ message: "Verification token created and sent successfully." });
  } catch (err) {
    console.error("Error:", err);
    return res
      .status(500)
      .json({ message: "Failed to create or send verification token." });
  }
};

const resetPassword = async (req, res, next) => {
  const { password, confirmpassword, token } = req.body;

  // Check if password, confirmPassword, and token are provided
  if (!password || !confirmpassword || !token) {
    return res
      .status(400)
      .json({ message: "password, confirm password, and token are required." });
  }

  // Check if password matches confirmPassword
  if (password !== confirmpassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    // Find the verification token
    const verificationToken = await VerificationToken.findOne({ token });

    if (!verificationToken) {
      return res.status(400).json({ message: "Invalid token." });
    }

    // Check if the token is expired (if needed)

    // Find the user associated with the token
    const user = await User.findById(verificationToken.userId);

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Update user's password

    const hashedPassword = bcrypt.hashSync(password);

    user.password = hashedPassword; // Assuming user.password is hashed, otherwise hash the password
    await user.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Failed to reset password." });
  }
};

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const baseUrl = req.protocol + '://' + req.get('host');

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res
      .status(401)
      .json({ message: "Unauthorized.. Please login or sign up" });
  }

  try {
    // Verify JWT token
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) {
          // If JWT token verification fails, try to authenticate via Google OAuth
          const profileData = await authenticateViaGoogleOAuth(token);
          if (profileData) {
            // If profile data is received, include it in req.user and proceed
            req.user = profileData;
            next();
          } else {
            // If profile data is not received, user is not authenticated
            return res.status(401).json({ message: "Unauthorized" });
          }
        } else {
          // If JWT token is valid, include decoded token in req.user and proceed
          req.user = decodedToken;
          next();
        }
      }
    );
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const authenticateViaGoogleOAuth = async (token) => {
  try {
    // Fetch profile data from Google OAuth API
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`
    );
    const profileData = response.data;
    return profileData;
  } catch (error) {
    console.error("Error authenticating via Google OAuth:", error);
    return null;
  }
};

const getUserProfile = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const baseUrl = req.protocol + '://' + req.get('host');

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Access token not provided." });
  }

  try {
    let user;
    let googleUser;

    // First, attempt Google OAuth authentication
    googleUser = await authenticateViaGoogleOAuth(token);
    if (!googleUser) {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Extract user details from the decoded token
      const userId = decodedToken.userId;

      // Fetch user details from the database using the userId
      user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Append base URL to the profile picture path
      user.profilePicture = baseUrl + '/' + user.profilePicture;
    } else {
      user = googleUser;
      user.profilePicture = googleUser.picture; // Assuming 'picture' is the correct property for Google profile picture
    }

    // Send user details in the response
    return res.status(200).json({ userProfile: user });
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};







module.exports = {
  signUp,
  userVerify,
  signIn,
  forgotPassword,
  resetPassword,
  authenticateToken,
  getUserProfile,
};
