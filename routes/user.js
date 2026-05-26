const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const passport = require("passport");
const userController = require("../controller/user.js");

router.get("/", (req, res) => {
  res.redirect("/listings");
});
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.submitSignup));
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.submitLogin),
  );
router.get("/logout", userController.logout);
module.exports = router;
