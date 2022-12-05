const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: '************', 
    api_key: '**************', 
    api_secret: '****************' 
  });

//view engine middleware
app.set("view engine","ejs");
// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(fileUpload(
    {
        useTempFiles : true,
        tempFileDir : '/tmp/'
    }
))



app.get("/",(req,res)=>{
    res.send("file upload working here")
})


// my get route
app.get("/myget",(req,res)=>{
    console.log(req.body);
    res.send(req.query);
})

// my post route
app.post("/mypost", async(req, res)=>{

    // ########### multi file case
let imageArray=[];
let result;

if(req.files){
    for (const file of req.files.fileName) {
        result = await cloudinary.uploader.upload(file.tempFilePath,{
            folder:'users'
        }) 

imageArray.push({
    public_id :result.public_id,
    secure_url: result.secure_url
})
    }
}


// #############single file case

// let file = req.files.fileName;
//   let result = await cloudinary.uploader
//     .upload(file.tempFilePath,{
//         folder:'users'
//     })

    res.json({
        FirstName:req.body.firstName, 
        LastName:req.body.lastName,
        imageArray
        
    })
})
//rendering the page
app.get("/getform", (req, res)=>{
res.render("getform")
})

//rendering the Post page
app.get("/postform", (req, res)=> { 
    res.render("postform")
    })
    


module.exports=app;