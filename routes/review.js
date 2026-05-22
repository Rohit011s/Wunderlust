const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const schemaValidation = require("../schemaValidation.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isAuthor } = require("../middleware.js");
const reviewController = require("../controller/review.js");


//review schema
const validateReview = (req, res, next) => {
  let { error } = schemaValidation.reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};



//post review
router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(reviewController.postReview),
);

//delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  reviewController.deleteReview,
);
module.exports = router;
