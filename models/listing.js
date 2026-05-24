const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    filename: { type: String, },
    url: { type: String, 
      default: "https://share.google/iPLY1tVbzPErK0nTy",
      set: (v) => (v === "" ? "https://share.google/iPLY1tVbzPErK0nTy" : v),
    },
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  reviews: [
    {
      type:Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  category: { type: String, enum: ["Apartment", "House", "Camping", "Igloo", "Mountain", "Treehouse", "Boat", "Other"], default: "Other"},
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

});

listingSchema.post("findOneAndDelete", async (listing)=> {
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
