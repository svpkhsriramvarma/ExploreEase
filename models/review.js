const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createAt: {
    type: Date,
    default: new Date(),
  },
  author : {
    type:Schema.Types.ObjectId,
    ref:"User",
  }
});

module.exports = mongoose.model("Review", reviewSchema);
