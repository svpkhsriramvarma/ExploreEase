if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");

//Model(Schema)
const Review = require("./models/review.js"); //doute
const User = require("./models/user.js");

//routers
const listingRoute = require("./router/listing.js");
const reviewRoute = require("./router/review.js");
const userRoute = require("./router/user.js");

const app = express();

const db_url = process.env.ATLASDB_URL;
const serectCode = process.env.SECRET_CODE;

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(db_url);
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// app.get("/", (req, res) => {
//   res.send("working...");
// });

//mongo store
const store = mongoStore.create({
  mongoUrl: db_url,
  crypto: {
    secret: serectCode,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error on mongoStore");
});

//session options
const sessionOptions = {
  store,
  secret: serectCode,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//flash
app.use(session(sessionOptions));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //adding all the details of user to web application
passport.deserializeUser(User.deserializeUser()); //removing all the details of user form application

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.userDetails = req.user;
  next();
});

//Router middleware
app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

//middle wares for locals

// app.get("/demoUser",async (req,res) => {
//   let fakeUser = new User({
//     email:"sriram@gmail.com",
//     username:"sriramvarma",
//   });

//   let fakeUserData = await User.register(fakeUser,"helloworld");
//   res.send(fakeUserData);
// })

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "pageNot Found!"));
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.userDetails = req.user;
  next();
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("listings/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("App is listening at 8080");
});
