const express = require("express")
const app = express();
const mongoose = require("mongoose")
const path = require("path")
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")

app.set("views", path.join(__dirname, "views"));
app.set("view engin", "ejs");
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended : true}))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate);

const MONGO_URL = 'mongodb://127.0.0.1:27017/finalproject';

main().then(() =>{
    console.log("connected to DB");
}).catch((err) =>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) =>{
    res.send("This is a root node");
})

// Index Route
app.get("/listings", async(req, res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

//New Route
app.get("/listings/new", (req, res) =>{
    res.render("listings/new.ejs")
})

// Show Route
app.get("/listings/:id", async(req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing})
})

// Create Route
app.post("/listings", async(req, res) =>{
    // First method 
    // let { title, description, image, price, country, location } = req.body;  // extracting all the variable form the "NEW.EJS" file
    
    
    //second method in new.ejs we can write ' name = "listeing[title]"' like others
    const newListing = new Listing(req.body.listing);  //instanse create new Listing
    await newListing.save();
    res.redirect("/listings");
})

// Edit Route
app.get("/listings/:id/edit", async(req, res) =>{
    let { id } = req.params;   //extracting the ID // also did "extended : true" in staring 
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})

// Update Route
app.put("/listings/:id", async(req, res) =>{
    let { id } = req.params;    //extract the ID
    await Listing.findByIdAndUpdate(id, {...req.body.listing})  //...deconstract the JS object, after that divide one by one
    // res.redirect("/listings")  I can use this one also but this is directly redirect to the listing page 
    res.redirect(`/listings/${id}`);  //This is directly redirect to the show.ejs page. or maybe edit.ejs page. Let me check 
})

// Delete Route
app.delete("/listings/:id", async(req, res) =>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})


// app.get("/testListing", async(req, res) =>{
//     let sampleListing = new Listing ({
//         title : "Book Stand",
//         description : "Book stand for home and office",
//         price : 1200,
//         location : "Vadodara Guj",
//         country : "india"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing")
// });




app.listen(8080, () =>{
    console.log("server is working on 8080")
})