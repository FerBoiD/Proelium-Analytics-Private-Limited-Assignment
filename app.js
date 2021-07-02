const user = require("../../IMS/v5/models/user");

var PORT = process.env.PORT || 5000;

var express                 =require("express"),
    app                     =express(),
    bodyParer               =require("body-parser"),
    mongoose                =require("mongoose"),
    methodOverride           =require("method-override"),
    bcrypt                  =require("bcrypt-nodejs");


app.use(bodyParer.urlencoded({extended:true}));

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

var nowDate= (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

mongoose.connect("mongodb://localhost:/assignment",{useNewUrlParser:true , useUnifiedTopology: true ,useFindAndModify: false },function(err){
    if(err){
        console.log(err)
    }else{
        console.log("Connected to Database");
    }
});
app.use(methodOverride("_method"));
app.set("view engine","ejs");

var ProfileSchema=new mongoose.Schema({
    firstName:{type:String, required:true,unique:true},
    middleName:{type:String, required:true,unique:true},
    lastName:{type:String, required:true,unique:true},
    email:{type:String, required:true,unique:true},
    password:{type:String, required:true,unique:true},
    department:{type:String, required:true,unique:true},
    createdDate:{ type: Date, default: Date.now },
    updatedDate:{ type: Date }
});

ProfileSchema.pre('save',function(next){
    var user=this;
    bcrypt.hash(user.password,null,null,function(err,hash){
        if(err){
            console.log(err);
            return next(err)
        }else{
            user.password=hash;
            next()
        }
    })
});


var User=mongoose.model("User",ProfileSchema);
var Admin=mongoose.model("Admin",ProfileSchema);

app.get("/",(req,res)=>{
    User.find({},(err,allUsers)=>{
        if(err){
            console.log(err)
        }else{
            Admin.find({},(err,allAdmins)=>{
                if(err){
                    console.log(err)
                }else{
                    res.render("landing",{admins:allAdmins,users:allUsers});
                }
            })
        }
    })
})



// ===============================USER==========================================================================
// ===============================USER==========================================================================
// ===============================USER==========================================================================

app.get("/adduser",(req,res)=>{
    res.render("adduser");
})

app.post("/adduser",(req,res)=>{
    var usr={firstName: req.body.namee, middleName:req.body.middle,lastName:req.body.last, email:req.body.email, password:req.body.password, department:req.body.department,}
    console.log(usr);
    User.create(usr,(err,newUser)=>{
        if(err){
            console.log("Please ensure all the fields are unique");
            res.redirect("/");
        }else{
            // console.log(newUser);
            res.redirect("/");
        }
    })
})



app.get("/user/:id/edit",(req,res)=>{
       
    User.findById(req.params.id,(err,foundUser)=>{
        if(err){
            console.log(err)
        }else{
            res.render("edituser",{user:foundUser});
        }
    })
})

app.put("/user/:id",(req,res)=>{
    User.findById(req.params.id,(err,foundUser)=>{
        if(err){
            console.log("Please ensure all the fields are unique");
            res.redirect("/");
        }else{
            var usr={firstName: req.body.namee, middleName:req.body.middle,lastName:req.body.last, email:req.body.email, password:req.body.password, department:req.body.department,createdDate:foundUser.createdDate, updatedDate: nowDate};
            console.log(usr); 
            User.findByIdAndUpdate(req.params.id,usr,(err,UpdatedUser)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log("User Updated");
                    res.redirect("/");
                }
            })
        }
    })
    
})

// ===============================ADMIN==========================================================================
// ===============================ADMIN==========================================================================
// ===============================ADMIN==========================================================================


app.get("/addAdmin",(req,res)=>{
    res.render("addAdmin");
})

app.post("/addAdmin",(req,res)=>{
    var adm={firstName: req.body.namee, middleName:req.body.middle,lastName:req.body.last, email:req.body.email, password:req.body.password, department:req.body.department,}
    console.log(adm);
    Admin.create(adm,(err,newAdmin)=>{
        if(err){
            console.log("Please ensure all the fields are unique");
            res.redirect("/");
        }else{
            console.log(newAdmin);
            res.redirect("/");
        }
    })
})



app.get("/admin/:id/edit",(req,res)=>{
       
    Admin.findById(req.params.id,(err,foundAdmin)=>{
        if(err){
            console.log(err)
        }else{
            res.render("editadmin",{admin:foundAdmin});
        }
    })
})

app.put("/admin/:id",(req,res)=>{
    Admin.findById(req.params.id,(err,foundAdmin)=>{
        if(err){
            console.log("Please ensure all the fields are unique");
            res.redirect("/");
        }else{
            var adm={firstName: req.body.namee, middleName:req.body.middle,lastName:req.body.last, email:req.body.email, password:req.body.password, department:req.body.department,createdDate:foundAdmin.createdDate, updatedDate: nowDate};
            console.log(adm); 
            Admin.findByIdAndUpdate(req.params.id,adm,(err,UpdatedAdmin)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log("Admin Updated");
                    res.redirect("/");
                }
            })
        }
    })
    
})


app.listen(PORT,function(){
    console.log("Server has started.....");
});
