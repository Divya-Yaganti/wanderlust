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
    default:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    type: String,
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
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