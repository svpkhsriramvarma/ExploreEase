const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { redirectUrlMidWare } = require("../middleware.js");
const controllerUser = require("../controllers/users.js");

router
  .route("/signup")
  .get(controllerUser.getSignup)
  .post(wrapAsync(controllerUser.postSignup));

router
  .route("/login")
  .get(controllerUser.getLogin)
  .post(
    redirectUrlMidWare,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(controllerUser.postLogin)
  );

router.get("/logout", controllerUser.logout);

module.exports = router;
