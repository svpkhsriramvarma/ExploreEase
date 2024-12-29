const express = require("express");
const router = express.Router();
const wrapAysnc = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { listingSchema } = require("../schema.js");
const { isLogin, isOwner } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//joi validatation for listings.
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

router
  .route("/")
  //index route
  .get(wrapAysnc(listingControllers.index))
  .post(
    isLogin,
    //validateListing(middle ware we have to write here)
    upload.single("listing[image]"),
    wrapAysnc(listingControllers.postListing)
  );

//form route for new
router.get("/new", isLogin, wrapAysnc(listingControllers.newListing));

router
  .route("/:id")
  //update route
  .put(
    isLogin,
    isOwner,
    upload.single("listing[image]"),
    wrapAysnc(listingControllers.updateLising)
  )
  //delete route
  .delete(isLogin, isOwner, wrapAysnc(listingControllers.destroyListing))
  //show route
  .get(wrapAysnc(listingControllers.showRoute));

//Edit route
router.get(
  "/:id/edit",
  isLogin,
  isOwner,
  wrapAysnc(listingControllers.editListing)
);

router.get("/icons/:val",wrapAysnc(listingControllers.filterIcons));

module.exports = router;
