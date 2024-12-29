const Joi = require("joi");

module.exports.listingShema = Joi.object({
  // listing : Joi.object({
  //     title : Joi.string().required();
  // }).required()
  title: Joi.string().required(),
  price: Joi.number().required().min(0),
  country: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  url: Joi.string().allow("", null),
  filename: Joi.string().optional(),
});


module.exports.reviewSchema = Joi.object({
  review:Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment : Joi.string().required(),
  }).required()
});

