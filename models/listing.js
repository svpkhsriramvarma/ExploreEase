const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js");

const listSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
      default:
        "https://wallpapers.com/images/featured/4k-nature-ztbad1qj8vdjqe0p.jpg",
      set: (v) =>
        v === ""
          ? "https://wallpapers.com/images/featured/4k-nature-ztbad1qj8vdjqe0p.jpg"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  category: {
    type:String,
    enum:["Mountains","Rooms","Farms"],
  },
});

listSchema.post("findOneAndDelete", async (listings) => {
  if (listings) {
    await review.deleteMany({ _id: { $in: listings.review } });
  }
});

const listing = mongoose.model("listing", listSchema);

module.exports = listing;
