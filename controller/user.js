const User = require("../models/user.js");
module.exports.renderSignupForm = (req, res) => {
  res.render("./users/signup.ejs");
};
module.exports.submitSignup=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {return next(err);};
        console.log(registeredUser);
        req.flash("success", "Welcome to Wunderlust!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };
 module.exports.renderLoginForm =(req, res) => {
  res.render("./users/login.ejs");
};
module.exports.submitLogin=async (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl=res.locals.redirectUrl;
    res.redirect(redirectUrl);
  };
  module.exports.logout=(req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out!");
    res.redirect("/listings");
  });
};