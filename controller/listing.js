const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let listings = await Listing.find({});
  res.render("./listings/index.ejs", { listings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Cannot find the listing !");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};
module.exports.createListing = async (req, res) => {
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "Successfully created a new listing !");
  res.redirect("/listings");
};
module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Cannot find the listing !");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let update = await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Successfully updated the listing !");
  res.redirect(`/listings/${id}`);
};
module.exports.delterListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the listing !");
  res.redirect("/listings");
};
