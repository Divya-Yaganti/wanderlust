const Listing=require("./models/listing");
const { listingSchema } = require('./schema.js');
const ExpressError=require("./utils/ExpressError.js");
const { reviewSchema } = require('./schema.js');
const Review=require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>
{
    if(!req.isAuthenticated())
  {
    //redirect url
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","You must be logged in first!");
    return res.redirect("/user/login");
  }
  next();
 
};

module.exports.loginAfter=async (req, res) => {
    req.flash("success", "Welcome Back to WanderLust! You are logged in!");

    // 🧠 FIX: Clean up the stored redirect URL
    let redirectUrl = "/listings";
  if (res.locals.redirectUrl) {
  let cleanUrl = res.locals.redirectUrl.split("?")[0];

  // 🧠 If the stored URL was a review route, go back to the listing instead
  if (cleanUrl.includes("/reviews/")) {
    cleanUrl = cleanUrl.split("/reviews/")[0];
  }

  // Only allow redirects within /listings to prevent open redirects
  if (cleanUrl.startsWith("/listings")) {
    redirectUrl = cleanUrl;
  }
}


    delete req.session.redirectUrl; // cleanup
    res.redirect(redirectUrl);
  }

module.exports.saveRedirectUrl=(req,res,next)=>
{
    if(req.session.redirectUrl){
      res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;   
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id))
    {
        req.flash("error","You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }    
   next();
};

module.exports. validateListing=(req,res,next)=>
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

 module.exports.validateReview=(req,res,next)=>
{
    const {error}=reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

module.exports.isreviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;   
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currentUser._id))
    {
        req.flash("error","You do not have permission to delete this review!");
        return res.redirect(`/listings/${id}`);
    }    
   next();
};