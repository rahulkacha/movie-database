const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render("index");
})

// ADD A NEW MOVIE 
app.get("/add", (req, res) => {
    res.render("add");
})

app.post("/add", (req, res) => {
    console.log(req.body);

})

// SELECT THE MOVIE FROM THE LIST
app.get("/select", (req, res) => {
    res.render("select");
})

app.post("/select", (req, res) => {
    console.log(req.body);
})

// EDIT THE REVIEW 
app.get("/edit", (req, res) => {
    res.render("edit");
})

app.post("/edit", (req, res) => {
    console.log(req.body);
})

app.listen(5000, () => {
    console.log("app listening on port 5000.");
})