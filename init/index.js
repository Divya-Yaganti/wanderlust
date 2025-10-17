const mongoose=require('mongoose');

const Listing=require('../models/listing');
const initData = require("./data"); 


main()
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const intiDB=async()=>
{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"68ee52a07bea46a0d8ee94e7"}));
    await Listing.insertMany(initData.data);
    console.log("Database initialized");
}
intiDB();