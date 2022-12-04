require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const whitelist = [
  "https://kudzaijalos.netlify.app",
  "https://main--kudzaijalos.netlify.app",
  // "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

const { createProxyMiddleware } = require('http-proxy-middleware');
app.use('/api', createProxyMiddleware({ 
    target: 'https://kudzai-jalos-api.herokuapp.com/', //original url
    changeOrigin: true, 
    //secure: false,
    onProxyRes: function (proxyRes, req, res) {
       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

// import routers
const rootRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
// Configure app
app.use(bodyParser.json());



// routers
app.use(rootRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

app.use((error, req, res, next) => {
  console.log(error);
  if (!error.code) {
    error.code = 500;
    error.originalMessage = error.message;
    error.message = "Something went wrong...";
  }
  res.status(error.code).json({
    message: error.message,
    data: error.data,
  });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.zrgns.mongodb.net/portfolio?retryWrites=true&w=majority`
    // "mongodb://localhost:27017/"+process.env.MONGODB_DB
  )
  .then((result) => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to mongodb")
    throw err;
  });
