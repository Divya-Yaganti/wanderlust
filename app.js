const express = require('express');
const app = express();
const ejsMate=require('ejs-mate');
const mongoose = require('mongoose');
//Server side schema(models)
const Listing = require('./models/listing');
const Review=require("./models/review.js")
const User=require("./models/user.js");

const path=require('path');
const methodOverride=require('method-override');
//utils
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
//client side validations(Schema.js) Joi schema
const { listingSchema } = require('./schema.js');
const { reviewSchema } = require('./schema.js');
//routes
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
// express sessions
const session=require("express-session");
//connect-flash(to pop meesages like listing added deleted etc)
const flash=require("connect-flash");
//passport(for authentication)
const passport=require("passport");
const LocalStrategy=require("passport-local");

 

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

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
 
const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    //console.log(req.session);
    res.send("root is working");
});

app.use((req,res,next)=>{
     res.locals.success=req.flash("success");
     res.locals.error=req.flash("error");
     next();
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


app.use((err,req,res,next)=>
{
    let {statusCode=500,message="Something went wrong"}=err;
   res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
