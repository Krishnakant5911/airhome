const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const path = require('path');
const methodoverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressErr = require("./utils/ExpressError.js");

const listings = require("./routes/listings.js");
const Reviews = require("./routes/review.js");





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


app.use("/listings" , listings);
app.use("/listings/:id/reviews" , Reviews);


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