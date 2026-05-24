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
  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
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
  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload", "/upload/w_300");
  res.render("listings/edit.ejs", { listing, originalImage });
};
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let update = await Listing.findByIdAndUpdate(id, req.body.listing);
  let requestedUpdate = req.body.listing;
  console.log(requestedUpdate);

  console.log(update);
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    update.image = { url, filename };
    await update.save();
  }
  req.flash("success", "Successfully updated the listing !");
  res.redirect(`/listings/${id}`);
};
module.exports.delterListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the listing !");
  res.redirect("/listings");
};
