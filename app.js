const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const path = require('path');
const methodoverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErr = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("./schema.js");




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("connected to database")
  }).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
}

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(result);
  if (error) {
    let errMsg = error.details.map((el) => el.message.join(','));
    throw new ExpressErr(404, errMsg);
  } else {
    next();
  }
}
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  console.log(result);
  if (error) {
    let errMsg = error.details.map((el) => el.message.join(','));
    throw new ExpressErr(404, errMsg);
  } else {
    next();
  }
}
// NEW ROOUTE
app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
  //  let{title , description , image , price , country, location} = req.body;
  const allListing = await new Listing(req.body.listing);
  await allListing.save();
  res.redirect("/listings");
}));

// SHOW ROUTE
app.get("/listing/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const allListing = await Listing.findById(id).populate("reviews");
  res.render("./listings/show.ejs", { allListing });
}));

// EDIT FIELD
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing });
}));

app.put("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings`);
}));

// DELETE ROUTE
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

// REVIEWS
// POST ROUTE
app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req,res)=> {
    let listing =  await Listing.findById(req.params.id);
    
   let newReview = new Review(req.body.review);

   listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
     res.redirect(`/listing/${listing._id}`);

})
)

app.get("/listings", wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render("./listings/index.ejs", { allListing });
}));

app.get('/', (req, res) => {
  res.send("hi i am root");
});

// FOR ALL TYPE OF ROUTES
app.all('/*splat', (req, res, next) => {
  next(new ExpressErr(404, "page not found"));
});

// //  FOR ERROR HANDLING
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "please provide the required info" } = err;
  res.status(statusCode).render("error.ejs", { message });
  //  res.status(statusCode).send(message);
})
app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
})