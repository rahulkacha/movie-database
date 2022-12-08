const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const routes = require("./routes/routes");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

const DB_URL =
  "mongodb+srv://rahul-admin:" +
  process.env.MONGODB_PASSWORD +
  "@cluster0.itvnp8i.mongodb.net/?retryWrites=true&w=majority";


// supressed some warning 
mongoose.set("strictQuery", true);

// DB_CONNECTION
mongoose.connect(DB_URL);
// // ROUTES
app.use(routes); 

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}.`);
});
