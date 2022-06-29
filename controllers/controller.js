const axios = require("axios");
const Movie = require("../models/movie");
const moment = require("moment");

const API_ENDPOINT_1 = "https://api.themoviedb.org/3/search/movie?";
const API_ENDPOINT_2 = "https://api.themoviedb.org/3/movie/";
const API_KEY = process.env.API_KEY;

const index = (req, res) => {
  Movie.find({}, (err, movies) => {
    res.render("index", { movies: movies, moment: moment });
  }).sort({ rating: "desc" });
};

const addGET = (req, res) => {
  res.render("add");
};

const addPOST = (req, res) => {
  axios({
    method: "GET",
    url: API_ENDPOINT_1,
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
};

const findGET = (req, res) => {
  axios({
    method: "GET",
    url: API_ENDPOINT_2 + req.params.movie_id,
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
};

const editGET = (req, res) => {
  res.render("edit", { title: req.params.title });
};

const editPOST = (req, res) => {
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
};

const deleteGET = (req, res) => {
  Movie.findOneAndDelete({ title: req.params.title }, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
};

module.exports = {
  index,
  addGET,
  addPOST,
  findGET,
  editGET,
  editPOST,
  deleteGET,
};
