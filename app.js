const express = require('express');
const app = express();
const ejsMate=require('ejs-mate');
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path=require('path');
const methodOverride=require('method-override');
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

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


app.get('/', (req, res) => {
    res.send("root is working");
});

// app.get('/testListing',async (req,res)=>
// {
// let sampleListing=new Listing(
//     {
//         title:"New Villa",
//         description:"A beautiful villa",
//         image:"",
//         price:10000,
//         location:"Goa",
//         country:"India"
//     }
// );
//     await sampleListing.save();
//     console.log("Listing saved");
//     res.send("Listing saved");
// });

//listings routes
app.get("/listings",wrapAsync (async (req,res)=>
{
  const allListings=await Listing.find({});
  //console.log(allListings);
  res.render("listings/index.ejs",{allListings});


}));

//new route
app.get("/listings/new",(req,res)=>
{
  res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id",wrapAsync (async(req,res)=>
{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/show.ejs",{listing});
}));



//create route
app.post("/listings",wrapAsync (async(req,res,next)=>
{
  if(!req.body.listing) throw new ExpressError(400,"Invalid Listing Data");
      let newlisting=new Listing(req.body.listing);
      await newlisting.save();
      res.redirect("/listings");

})
);

//edit route
app.get("/listings/:id/edit",wrapAsync (async(req,res)=>
{
    let {id}=req.params;
     const listing=await Listing.findById(id);
     
   res.render("listings/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id",wrapAsync (async(req,res)=>
{
    let {id}=req.params;        
    const listing=await Listing.findByIdAndUpdate(id,req.body.listing);
    res.redirect("/listings");
}));

//delete route
app.delete("/listings/:id",wrapAsync (async(req,res)=>
{
    let {id}=req.params;        
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// app.all("/*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });

// ...existing code...
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
// ...existing code...

app.use((err,req,res,next)=>
{
    let {statusCode=500,message="Something went wrong"}=err;
 //
   // res.send("Something went wrong");
   res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
