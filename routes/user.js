const express=require("express");
const router=express.Router({ mergeParams: true });
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const User=require("../models/user.js");
const Listing = require('../models/listing.js');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const {saveRedirectUrl,loginAfter}=require("../middleware.js");
const userController=require("../controllers/users.js");


router.route("/signup")
.get(userController.renderSignupForm ) //render Signup Route
.post(wrapAsync(userController.signup)); //Signup Route



router.route("/login")
.get(userController.renderLoginForm ) //Render Login Route
.post(saveRedirectUrl,
    passport.authenticate("local",
        {failureRedirect:'/user/login',
            failureFlash:true}),
          loginAfter,
         userController.login    
        );   //Login  Route



 //Logout Route
router.get("/logout",userController.logout );

module.exports=router;