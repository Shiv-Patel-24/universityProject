const mongoose = require("mongoose")
const Schema = mongoose.Schema

const listingSchema = new Schema ({
    title : {
        type : String,
        require : true
    },
    description : String,
    image :{
        type : String,
        default : "https://www.whiteteak.com/media/catalog/product/h/l/hl174-10005_11_.jpg?optimize=medium&fit=bounds&height=&width=",  
        set: (v) => 
            v === "" 
            ? "https://images.unsplash.com/photo-1577618163295-29d57a40e2b2?q=80&w=2040&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://www.whiteteak.com/media/catalog/product/h/l/hl174-10005_11_.jpg?optimize=medium&fit=bounds&height=&width="
            : v,
    },
    price : Number,
    location : String, 
    country : String 
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing