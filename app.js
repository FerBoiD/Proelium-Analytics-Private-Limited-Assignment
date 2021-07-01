const user = require("../../IMS/v5/models/user");

var PORT = process.env.PORT || 5000;

var express                 =require("express"),
    app                     =express(),
    bodyParer               =require("body-parser"),
    mongoose                =require("mongoose");


app.use(bodyParer.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:/assignment",{useNewUrlParser:true , useUnifiedTopology: true ,useFindAndModify: false },function(err){
    if(err){
        console.log(err)
    }else{
        console.log("Connected to Database");
    }
});

app.set("view engine","ejs");

var ProfileSchema=new mongoose.Schema({
    firstName:{type:String, required:true,unique:true},
    middleName:{type:String, required:true,unique:true},
    lastName:{type:String, required:true,unique:true},
    email:{type:String, required:true,unique:true},
    password:{type:String, required:true,unique:true},
    department:{type:String, required:true,unique:true},
    createdDate:{ type: Date, default: Date.now },
    updatedDate:{ type: Date, default: Date.now }
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

app.get("/adduser",(req,res)=>{
    res.render("adduser");
})

app.post("/adduser",(req,res)=>{
    var usr={firstName: req.body.namee, middleName:req.body.middle,lastName:req.body.last, email:req.body.email, password:req.body.password, department:req.body.department}
    console.log(usr);
    User.create(usr,(err,newUser)=>{
        if(err){
            console.log(err)
        }else{
            console.log(newUser);
            res.redirect("/");
        }
    })
})






app.listen(PORT,function(){
    console.log("Server has started.....");
});
