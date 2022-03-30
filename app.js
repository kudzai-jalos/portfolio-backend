require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// import routers
const rootRouter = require("./routes/index");

// Configure app
app.use(bodyParser.json());
app.use(cors());
// routers
app.use(rootRouter);
app.use((error, req, res, next) => {
  if (!error.code) {
    error.code = 500;
  }
  res.status(error.code).json({
    message: error.message,
  });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`
    // "mongodb://localhost:27017/"+process.env.MONGODB_DB
  )
  .then((result) => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch((err) => {
    throw err;
  });
