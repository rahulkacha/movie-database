const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: String,
  year: String,
  description: String,
  rating: { type: Number, default: 0 },
  review: { type: String, default: "none" },
  img_url: String,
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
