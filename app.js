const express = require("express")
const app = express();
const mongoose = require("mongoose")
const path = require("path")
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema} = require("./schema.js")
const session = require("express-session");
const flash = require("connect-flash")

const listings = require("./routes/listings.js")
const reviews = require("./routes/reviews.js")

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

const sessionOption = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie :{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
}

app.use(session(sessionOption))
app.use(flash())

app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/", (req, res) =>{
    res.send("This is a root node");
})

app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)

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

app.all("*", (req, res, next) =>{
    next(new ExpressError(404, "Page Not Found"))
})

// Error Handing code
app.use((err, req, res, next) =>{
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message })
    // res.status(statusCode).send(message);
    // res.send("Something went wrong");
})

app.listen(8080, () =>{
    console.log("server is working on 8080")
})