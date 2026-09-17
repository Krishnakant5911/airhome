const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErr = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");




const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressErr(400, errMsg);
    } else {
      next();
    }
  };


// INDEX ROUTE
router.get("/", wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render("./listings/index.ejs", { allListing });
}));

// HOME ROUTE
router.get('/', (req, res) => {
    res.send("hi i am root");
  });


// NEW ROUTE
router.get("/new", (req, res) => {
    res.render("./listings/new.ejs");
  });
  
  router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    //  let{title , description , image , price , country, location} = req.body;
    const allListing = await new Listing(req.body.listing);
    await allListing.save();
    res.redirect("/listings");
  }));
  
  // SHOW ROUTE
  router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const allListing = await Listing.findById(id).populate("reviews");
    if (!allListing) {
      throw new ExpressErr(404, "Listing not found");
    }
    res.render("./listings/show.ejs", { allListing });
  }));
  
  router.get("/:id", (req, res) => {
    res.redirect(`/listings/${req.params.id}`);
  });



//   EDIT ROUTE
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressErr(404, "Listing not found");
    }
    res.render("./listings/edit.ejs", { listing });
  }));
  
  router.put("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  }));
  
  // DELETE ROUTE
  router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }));

  module.exports = router;