const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const schemaValidation = require("../schemaValidation.js");
const flash = require("connect-flash");
const { isLoggedIn, isOwner } = require("../middleware.js");
//listing schema
const validateListing = (req, res, next) => {
  let { error } = schemaValidation.listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    res.render("./listings/index.ejs", { listings });
  }),
);
//new listing form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("./listings/new.ejs");
});
//show listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate({ path: "reviews" , populate:{path:"author"}})
      .populate("owner");
    if (!listing) {
      req.flash("error", "Cannot find the listing !");
      return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
  }),
);

//create listing
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing !");
    res.redirect("/listings");
  }),
);
//edit listing form
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Cannot find the listing !");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }),
);
//update listing
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let update = await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Successfully updated the listing !");
    res.redirect(`/listings/${id}`);
  }),
);
//delete listing
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing !");
    res.redirect("/listings");
  }),
);

module.exports = router;
