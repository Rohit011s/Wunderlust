const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const MONGO_URL = "mongodb://localhost:27017/wanderlust";
const ejs_mate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const schemaValidation = require("./schemaValidation.js");
const Review = require("./models/review.js");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejs_mate);
main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

//-------------------------------
app.get("/", (req, res) => {
  res.render("./listings/home.ejs");
}); 
//validation schema
//listing schema
const validateListing = (req, res, next) => {
let {error}=schemaValidation.listingSchema.validate(req.body);
if(error){
    let errMsg=error.details.map(el=>el.message).join(",");
    throw new ExpressError(400,errMsg);
}else{
  next();}};
//review schema
const validateReview = (req, res, next) => {
let {error}=schemaValidation.reviewSchema.validate(req.body);
if(error){
    let errMsg=error.details.map(el=>el.message).join(",");
    throw new ExpressError(400,errMsg);
}else{
  next();}};


app.get("/listings/new", (req, res) => {44
  res.render("./listings/new.ejs");
});
//all listings
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    res.render("./listings/index.ejs", { listings });
  })
);
//show listing
app.get(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { listing });
  }),
);
//create listing
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);
//edit listing form
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }),
);
//update listing
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let update = await Listing.findByIdAndUpdate(id, req.body.listing);
    console.log(update);
    res.redirect(`/listing/${id}`);
  }),
);
//delete listing
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }),
);
//reviews
//post review
app.post(
  "/listing/:id/reviews",validateReview,wrapAsync (async (req, res) => {
let listing=await Listing.findById(req.params.id);
let review=new Review(req.body.review);
listing.reviews.push(review);
await review.save();
await listing.save();
res.redirect(`/listing/${req.params.id}`);
  }));


//delete review
app.delete("/listings/:id/reviews/:reviewId",async(req,res)=>{
      let { id,reviewId} = req.params;
      await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
      await Review.findByIdAndDelete(reviewId);
      res.redirect(`/listing/${id}`);
});
/// error handling
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found !"));
});

app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  res.render("error.ejs", { err });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
