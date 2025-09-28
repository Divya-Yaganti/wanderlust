const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ListingSchema=new Schema({
    title:
    {
        type:String,
        reuired:true,
    },
    description:{
        type:String
    },
    image: {
    filename: { type: String,
    default:"listingimage",
    },
  url: {
    default:"https://www.istockphoto.com/stock-photos/nature-and-landscapes",
    type: String,
    set: (v) =>
      v === ""
        ? "https://www.istockphoto.com/stock-photos/nature-and-landscapes"
        : v,
  },
},

    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
});

const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;