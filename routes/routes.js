const express = require("express");
const controller = require("../controllers/controller");
const router = express.Router();

// ROUTES
router.get("/", controller.index);

// ADD A NEW MOVIE
router
  .route("/add")

  .get(controller.addGET)

  .post(controller.addPOST);

//FIND THE MOVIE
router.get("/find/:movie_id", controller.findGET);

// EDIT THE REVIEW
router
  .route("/edit/:title")
  .get(controller.editGET)

  .post(controller.editPOST);

//DELETE THE MOVIE
router.get("/delete/:title", controller.deleteGET);

module.exports = router;
