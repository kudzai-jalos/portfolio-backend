require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// import routers
const rootRouter = require("./routes/index")

// Configure app
app.use(bodyParser.json());

// routers
app.use(rootRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>{
  console.log("Server running on port "+PORT);
})