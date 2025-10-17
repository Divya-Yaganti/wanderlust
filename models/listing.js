const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require("./review.js");
const User=require("./user.js");

const ListingSchema=new Schema({
    title:
    {
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image: {
    filename: { type: String,
    // default:"listingimage",
    },
     url: {
    // default:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    type: String,
    // set: (v) =>
    //   v === ""
    //     ? "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
    //     : v,
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

    reviews:[
        {
           type:Schema.Types.ObjectId, 
           ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
   await Review.deleteMany({_id: {$in: listing.reviews}})
   }
});

const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;