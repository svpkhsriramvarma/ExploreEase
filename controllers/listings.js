
const mbxGeotocken = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeotocken({ accessToken: mapToken });
const listing = require("../models/listing.js");




module.exports.index = async (req, res) => {
  let allListings = await listing.find({});
  if(req.query.search) {
    let val = req.query.search;
    //const allListings = await listing.find({title:req.query.search});
    let filterValues = allListings.filter((e) => {
      if(e.title == val) {
        return e;
      } else if(e.country == val) {
        return e;
      } else if(e.owner == val) {
        return e;
      }
    });
    allListings = filterValues;
    return res.render("listings/index.ejs",{allListings});
  }
  // console.log(allListings);
  res.render("listings/index.ejs", { allListings });
};

module.exports.newListing = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showRoute = async (req, res) => {
  let { id } = req.params;
  let listData = await listing
    .findById(id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listData) {
    req.flash("error", "Listing Does not exit!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listData });
};

module.exports.postListing = async (req, res, next) => {
  let geocodingRes = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  console.log(req.body.listing.category);
  
  let url = req.file.path;
  let filename = req.file.filename;
 
  let newListing = new listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { filename, url };
  newListing.geometry = geocodingRes.body.features[0].geometry;
  let data = await newListing.save();
  console.log(data);
  req.flash("success", "image upladed successfuly");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listings = await listing.findById(id);
  if (!listings) {
    req.flash("error", "Listing you requested for does not exit!");
    return res.redirect("/listings");
  }
  let imageUrl = listings.image.url;
  imageUrl = imageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listings, imageUrl });
};

module.exports.updateLising = async (req, res) => {
  let { id } = req.params;
  let listingElements = await listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listingElements.image = { filename, url };
    await listingElements.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleateItem = await listing.findByIdAndDelete(id);
  console.log(deleateItem);
  req.flash("success", "Listin g Deleted!");
  res.redirect("/listings");
};


module.exports.filterIcons = async(req,res) => {
  let {val} = req.params;
  
  let allListings = await listing.find({category:val});
  if(allListings.length > 0) {
    return res.render("listings/index.ejs",{allListings});
  }
  req.flash("error","No listing is found!");
  res.redirect("/listings");
}