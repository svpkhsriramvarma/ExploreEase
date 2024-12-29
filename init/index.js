const mongoose = require("mongoose");
const initData = require("./data");
const listing = require("../models/listing.js");

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderLust");
}

let insertData = async () => {
  await listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: '67663c35eabbfd5fa6ae340d' }));
  await listing.insertMany(initData.data);
  console.log("Data inserted successfuly.");
};

insertData();
