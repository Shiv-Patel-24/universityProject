const express = require("express")
const app = express();
const mongoose = require("mongoose")
const path = require("path")
const Listing = require("./models/listing.js");

app.set("views", path.join(__dirname, "views"))
app.set("view engin", "ejs")
app.use(express.static(path.join(__dirname, "public")))

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