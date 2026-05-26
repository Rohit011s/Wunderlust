if(process.env.NODE_ENV !== "production"){
  require("dotenv").config();
}
const express = require("express");
const app = express();
app.set("trust proxy", 1);
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const MONGO_URL = "mongodb://localhost:27017/wanderlust";
const ejs_mate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const dbUrl = process.env.ATLASDB_URL;
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejs_mate);

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  collectionName: "mySessions",
});
store.on("error", function(e){
  console.log("mongo session store error", e);
});
const sessionOptions={
  store:store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};
main()
.then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

//-------------------------------
app.use(session(sessionOptions));
app.use(flash());
//--passport config--
app.use(passport.initialize());
app.use(passport.session());
//------------passport----------
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user || null;
  next();
});

//routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
// error handling
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
