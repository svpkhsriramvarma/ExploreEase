const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAysnc = require("../utils/wrapAsync.js");
const {validateReview,isLogin,isReviewAuthor} = require("../middleware.js");
const controllerReview = require("../controllers/reviews.js");


//Reviews post request
router.post(
  "/",
  isLogin,
  validateReview,
  wrapAysnc(controllerReview.createReview)
);

//Delete route for delete
router.delete(
  "/:reviewId",
  isLogin,
  isReviewAuthor,
  wrapAysnc(controllerReview.destroyReview)
);

module.exports = router;
