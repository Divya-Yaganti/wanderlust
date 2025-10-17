const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const { listingSchema } = require('../schema.js');
const ExpressError=require("../utils/ExpressError.js");
const Listing = require('../models/listing.js');
const Review=require("../models/review.js");
const {isLoggedIn}=require("../middleware.js");
const {isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(listingController.index) ) //Index Route
 .post(isLoggedIn,upload.single('listing[image][url]'),validateListing,wrapAsync (listingController.createListing));  //create route


//new route
router.get("/new",isLoggedIn,listingController.renderNewForm );

router.route("/:id")
.get(wrapAsync (listingController.showListing)) //show route
.put(isLoggedIn,isOwner,upload.single('listing[image][url]'),validateListing,wrapAsync (listingController.updateListing))  //update route
.delete(isLoggedIn,isOwner,wrapAsync (listingController.deleteListing));  //delete route



//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync (listingController.renderEditForm));



module.exports=router;