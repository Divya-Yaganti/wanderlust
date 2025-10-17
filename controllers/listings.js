const Listing = require('../models/listing.js');



// module.exports.index=async (req,res)=>
// {
//   const allListings=await Listing.find({});
//   //console.log(allListings);
//   res.render("listings/index.ejs",{allListings});
// };

// ...existing code...
// module.exports.index = async (req, res) => {
//   const q = (req.query.q || '').trim();
//   let allListings;
//   if (q) {
//     try {
//       // Preferred: MongoDB text search (needs the text index above)
//       allListings = await Listing.find(
//         { $text: { $search: q } },
//         { score: { $meta: "textScore" } }
//       ).sort({ score: { $meta: "textScore" } });
//     } catch (e) {
//       // Fallback: regex search across specific fields
//       const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
//       const regex = new RegExp(escapeRegex(q), 'i');
//       allListings = await Listing.find({
//         $or: [
//           { title: regex },
//           { description: regex },
//           { location: regex },
//           { country: regex }
//           // add other string fields here if needed
//         ]
//       });
//     }
//   } else {
//     allListings = await Listing.find({});
//   }
//   res.render("listings/index.ejs", { allListings, q });
// };
// ...existing code...

// ...existing code...
module.exports.index = async (req, res) => {
  const q = (req.query.q || '').trim();
  let allListings;
  if (q) {
    const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(escapeRegex(q), 'i');
    allListings = await Listing.find({
      $or: [
        { title: regex },
        { location: regex },
        { country: regex }
      ]
    });
  } else {
    allListings = await Listing.find({});
  }
  res.render("listings/index.ejs", { allListings, q });
};
// ...existing code...


module.exports.renderNewForm=(req,res)=>
{
  res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>
{
  let {id}=req.params;
  const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  if(!listing){
    req.flash("error","Listing you requested for does not exist");
    res.redirect("/listings");
  }
  else
  {
    res.render("listings/show.ejs",{listing});
  }
  
};

module.exports.createListing=async(req,res,next)=>
{
//   if(!req.body.listing) throw new ExpressError(400,"Invalid Listing Data");
      let url=req.file.path;
      let filename=req.file.filename;
      let newlisting=new Listing(req.body.listing);
      newlisting.image={url,filename};
      newlisting.owner=req.user._id;

      await newlisting.save();
      req.flash("success","new Listing created!");
      res.redirect("/listings");
};

module.exports.renderEditForm=async(req,res)=>
{
    let {id}=req.params;
     const listing=await Listing.findById(id);
     if(!listing){
    req.flash("error","Listing you requested for does not exist");
     return res.redirect("/listings");
    }
    let orignalImageUrl=listing.image.url;
    orignalImageUrl=orignalImageUrl.replace("/upload","/upload/w_200");
    res.render("listings/edit.ejs",{listing,orignalImageUrl});
};

module.exports.updateListing=async(req,res)=>
{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
    }

    // Update listing fields
    listing.set(req.body.listing);

    if(typeof req.file!=="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
    }

    await listing.save();
    req.flash("success"," Listing Updated!");
    res.redirect("/listings");
};

module.exports.deleteListing=async(req,res)=>
{
    let {id}=req.params;        
    await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted!");
    res.redirect("/listings");
};