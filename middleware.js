const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
module.exports.isLoggedIn = (req, res, next) => {
    let isloggedIn = req.isAuthenticated();
    if (!isloggedIn) {
        req.session.redirectUrl=req.originalUrl;
        return res.redirect('/login');
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl; 
    }else{
        res.locals.redirectUrl="/listings";
    }
    next();
};
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find the listing !");
        return res.redirect("/listings");
    }
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You don't have permission to do that !");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
      let {id, reviewId } = req.params;
      let reviews=await Review.findById(reviewId).populate("author");
      if(!reviews){
        req.flash("error", "Cannot find the review !");
        return res.redirect(`/listings/${id}`);
      }
      if(!reviews.author._id.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the owner of this review !");
        return res.redirect(`/listings/${id}`);
      }
      next();
}