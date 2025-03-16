const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js")

const validateListing = (req, res, next) =>{
    let { error } = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, result.error);
    }else{
        next();
    }
};

// Index Route
router.get("/", wrapAsync(async(req, res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//New Route
router.get("/new", (req, res) =>{
    res.render("listings/new.ejs")
})

// Show Route
router.get("/:id", wrapAsync(async(req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "listing you request for does not exist");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", {listing})
}));

// Create Route
router.post("/", validateListing, wrapAsync(async(req, res, next) =>{
    // First method 
    // let { title, description, image, price, country, location } = req.body;  // extracting all the variable form the "NEW.EJS" file
    
    //second method in new.ejs we can write ' name = "listeing[title]"' like others
    const newListing = new Listing(req.body.listing);  //instanse create new Listing
    await newListing.save();
    req.flash("success", "New Listing Created")
    res.redirect("/listings"); 
}))

// Edit Route
router.get("/:id/edit", wrapAsync(async(req, res) =>{
    let { id } = req.params;   //extracting the ID // also did "extended : true" in staring 
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// Update Route
router.put("/:id", validateListing, wrapAsync(async(req, res) =>{
    let { id } = req.params;    //extract the ID
    await Listing.findByIdAndUpdate(id, {...req.body.listing})  //...deconstract the JS object, after that divide one by one
    // res.redirect("/listings")  I can use this one also but this is directly redirect to the listing page 
    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`);  //This is directly redirect to the show.ejs page. or maybe edit.ejs page. Let me check 
}));

// Delete Route
router.delete("/:id", wrapAsync(async(req, res) =>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Updated")
    res.redirect("/listings");
}));

module.exports = router