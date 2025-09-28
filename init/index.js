const mongoose=require('mongoose');

const Listing=require('../models/listing');
const initData = require("./data"); 

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
});

const intiDB=async()=>
{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Database initialized");
}
intiDB();