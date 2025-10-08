const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const { listingSchema } = require('../schema.js');
const ExpressError=require("../utils/ExpressError.js");
const Listing = require('../models/listing.js');
const Review=require("../models/review.js");

const validateListing=(req,res,next)=>
{
    const {error}=listingSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};


//Index Route
router.get("/",wrapAsync (async (req,res)=>
{
  const allListings=await Listing.find({});
  //console.log(allListings);
  res.render("listings/index.ejs",{allListings});


}));

//new route
router.get("/new",(req,res)=>
{
  res.render("listings/new.ejs");
});

//show route
router.get("/:id",wrapAsync (async(req,res)=>
{
  let {id}=req.params;
  const listing=await Listing.findById(id).populate("reviews");
  if(!listing){
    req.flash("error","Listing you requested for does not exist");
    res.redirect("/listings");
  }
  else
  {
    res.render("listings/show.ejs",{listing});
  }
  
}));

//create route
router.post("/",validateListing,wrapAsync (async(req,res,next)=>
{
//   if(!req.body.listing) throw new ExpressError(400,"Invalid Listing Data");
      
      let newlisting=new Listing(req.body.listing);
      await newlisting.save();
      req.flash("success","new Listing created!");
      res.redirect("/listings");

}));

//edit route
router.get("/:id/edit",wrapAsync (async(req,res)=>
{
    let {id}=req.params;
     const listing=await Listing.findById(id);
     if(!listing){
    req.flash("error","Listing you requested for does not exist");
    res.redirect("/listings");
  }
    else{
    res.render("listings/edit.ejs",{listing});
    }
}));

//update route
router.put("/:id",validateListing,wrapAsync (async(req,res)=>
{
    let {id}=req.params;        
    const listing=await Listing.findByIdAndUpdate(id,req.body.listing);
    req.flash("success"," Listing Updated!");
    res.redirect("/listings");
}));

//delete route
router.delete("/:id",wrapAsync (async(req,res)=>
{
    let {id}=req.params;        
    await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted!");
    res.redirect("/listings");
}));

module.exports=router;