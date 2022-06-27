const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
const querystring = require("querystring");
const app = express();
const Movie = require("./database");
const moment = require("moment");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/movieDB");

API_ENDPOINT = "https://api.themoviedb.org/3/search/movie?";
API_KEY = process.env.API_KEY;

headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
  "Accept-Encoding": "gzip, deflate",
  Connection: "keep-alive",
};

// ROUTES
app.get("/", (req, res) => {
  Movie.find({}, (err, movies) => {
    res.render("index", { movies: movies, moment: moment });
  }).sort({ rating: "desc" });
});

// ADD A NEW MOVIE
app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", (req, res) => {
  https.get(
    API_ENDPOINT +
      "api_key=" +
      API_KEY +
      "&query=" +
      req.body.movie + 
      "&include_adult=true",
    (response) => {
      response
        .on("data", (data) => {
          const movies = JSON.parse(data)["results"];
          res.render("select", { list: movies, moment: moment });
        })
        .on("error", (err) => {
          console.log(err);
        });
    }
  );
});

//FIND THE MOVIE
app.get("/find/:movie_id", (req, res) => {
  https.get(
    "https://api.themoviedb.org/3/movie/" +
      req.params.movie_id +
      "?api_key=" +
      API_KEY,
    (response) => {
      response.on("data", (data) => {
        const movie = JSON.parse(data);

        const newMovie = new Movie({
          title: movie.title,
          year: movie["release_date"],
          description: movie["overview"],
          ratin: movie["vote_average"],
          img_url: `https://image.tmdb.org/t/p/original/${movie["poster_path"]}`,
        });
        newMovie.save((err, obj) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/edit/" + movie.title);
          }
        });
      });
    }
  );
});

// EDIT THE REVIEW
app.get("/edit/:title", (req, res) => {
  res.render("edit", { title: req.params.title });
});

app.post("/edit/:title", (req, res) => {
  if (req.body.review.length == 0) {
    var updateObject = {
      rating: req.body.rating,
    };
  } else {
    var updateObject = {
      rating: req.body.rating,
      review: req.body.review,
    };
  }
  Movie.findOneAndUpdate(
    { title: req.params.title },
    updateObject,
    (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    }
  );
});

//DELETE THE MOVIE
app.post("/delete/:title", (req, res) => {
  Movie.findOneAndDelete({ title: req.params.title }, (err, obj) => {
    if (err) {
      console.log(err);
    }
  });
});

app.listen(5000, () => {
  console.log("app listening on port 5000.");
});
