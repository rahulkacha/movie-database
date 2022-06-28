const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios");
const app = express();
const Movie = require("./database");
const moment = require("moment");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

const DB_URL =
  "mongodb+srv://rahul-admin:" +
  process.env.MONGODB_PASSWORD +
  "@cluster0.itvnp8i.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(DB_URL);

API_ENDPOINT = "https://api.themoviedb.org/3/search/movie?";
API_KEY = process.env.API_KEY;

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
  axios({
    method: "GET",
    url: API_ENDPOINT,
    headers: {
      Connection: "keep-alive",
    },

    params: {
      include_adult: true,
      api_key: API_KEY,
      query: req.body.movie,
    },
  })
    .then((result) => {
      const movies = result["data"]["results"];
      res.render("select", { list: movies, moment: moment });
    })
    .catch((err) => {
      res.send(
        `<h1> oops! some error occurred. <a autofocus href="/add">try again.</a></h1>\n
         <h2 style="color:red">${err}</h2>`
      );
    });
});

//FIND THE MOVIE
app.get("/find/:movie_id", (req, res) => {
  axios({
    method: "GET",
    url: "https://api.themoviedb.org/3/movie/" + req.params.movie_id,
    headers: {
      Connection: "keep-alive",
    },

    params: {
      include_adult: true,
      api_key: API_KEY,
    },
  })
    .then((result) => {
      const movie = result["data"];
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
    })
    .catch((err) => {
      res.send(
        `<h1> oops! some error occurred. <a autofocus href="/add">try again.</a></h1>\n
         <h2 style="color:red;">${err}</h2>`
      );
    });
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
app.get("/delete/:title", (req, res) => {
  Movie.findOneAndDelete({ title: req.params.title }, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}.`);
});
