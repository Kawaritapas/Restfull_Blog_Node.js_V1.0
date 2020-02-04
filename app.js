var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose= require("mongoose");
var methodOverride=require("method-override");
var sanitizer=require("express-sanitizer");
mongoose.set("useNewUrlParser",true);
mongoose.set("useUnifiedTopology",true);
mongoose.connect("mongodb://localhost/Blog_app");

var BlogSchema= new mongoose.Schema({
   title:String,
   image:String,
   body:String,
   created:{type:Date,default:Date.now}
});
var Blog= mongoose.model("Blog",BlogSchema);
app.set("view engine","ejs");
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(sanitizer());
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
     if(err){
      console.log(err);
     }else{
    console.log(blogs);
    res.render("index",{blogs:blogs})
     }
    })
});
app.get("/",function(req,res){
   res.redirect("/blogs");
});
app.get("/blogs/new",function(req,res){
  res.render("newblog.ejs")
});

app.post("/blogs",function(req,res){
   req.body.blog.body=req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog,function(err,newblog){
     if(err){
        console.log(err);
     }else{
        console.log(newblog);
       res.redirect("/blogs")
     }
   });
});

app.get("/blogs/:id",function(req,res){
   console.log(req.params);
  Blog.findById(req.params.id,function(err,blog){
     if(err){
      console.log(err);
     }else{
     res.render("show",{blog:blog})
     }
   })
});
//app.get("/blogs/delete/:id",function(req,res){
  //  Blog.deleteOne(req.params.title,function(err,deleted){
   // if(err){
    // console.log(err);
    //}else{
     //  console.log(deleted);
      // res.redirect("/blogs");
  // }
 //});
//})
app.delete("/blogs/:id",function(req,res){
   Blog.findByIdAndRemove(req.params.id,function(err,deleted){
   if(err){
   console.log(err);
   }else{
      res.redirect("/blogs");
   }
   })
})

app.get("/blogs/:id/edit",function(req,res){
   Blog.findById(req.params.id,function(err,found){
      if(err){
        res.redirect("/blogs")
      }else{
         res.render("edit",{blog:found});
      }
   }) 
});
app.put("/blogs/:id",function(req,res){
   req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updated){
    if(err){
      console.log(err);
    }else{
       res.redirect("/blogs/"+req.params.id);
    }
    })
});
// One more method of updating using post request
//app.post("/blogsupdate/:id",function(req,res){
  //   console.log(req.body);
    // Blog.updateOne(req.body.blog,function(err,updated){
     // if(err){
      //  console.log(err);
      //}else{
       //  res.redirect("/blogs")
     // }
     //});
//});

app.listen(3000,function(req,res){
   console.log("server is starting");
})