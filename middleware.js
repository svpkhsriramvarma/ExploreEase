const listing = require("./models/listing.js");
const ExpressError = require("./utils/expressError.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");


module.exports.isLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Save the requested URL
    req.flash("error", "Login to access the service"); // Flash an error message
    return res.redirect("/login"); // Stop further execution after redirecting
  }


  next(); 
};

module.exports.redirectUrlMidWare = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let AcOwner = await listing.findById(id);
  if (!AcOwner.owner._id.equals(res.locals.userDetails._id)) {
    req.flash("error", "You are not Owner of this Listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateReview =  (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


module.exports.isReviewAuthor =  async (req, res, next) => {
  let { id,reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.userDetails._id)) {
    req.flash("error","You are not author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
