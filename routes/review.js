const express=require("express");
const router=express.Router({mergeParams:true});
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const Listing = require('../models/listing.js');
const {isLoggedIn,validateReview,isreviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");



// post Review route
router.post("/",isLoggedIn,validateReview,wrapAsync (reviewController.createReview));

//Delete Review route
router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;