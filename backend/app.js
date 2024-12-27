//dependency initializations
const express = require("express");
const dotenv = require("dotenv").config();
const rateLimit = require("express-rate-limit");

const app = express();
app.on("connection", () => {
  console.log("listening");
});

// Rate limiting configuration
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per windowMs
  standardHeaders: true, 
  legacyHeaders: false,
  message: {
    error: "Too many requests, please try again later."
  }
});

// Apply rate limiting to all routes
app.use(globalLimiter);

//app configurations
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//route configs
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/keyRoutes"));
app.use(
  "/exam",
  require("./middlewares/keyChecker"),
  require("./routes/examRoutes")
);
app.use("*", require("./helpers/404handler"));

//error handler
app.use(require("./middlewares/errorHandler"));

module.exports = app;