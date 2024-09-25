const express = require("express");
const app = express();
const {adminAuth,userAuth} = require("./middlewares/auth")

 
//Making middleware to check authenticated user

app.use("/admin", adminAuth)
app.get("/admin/isLogin",(req,res)=>{
    res.send("Hey Admin ")
})
app.get("/user/login",(req,res)=>{
    res.send("This is user Login api")
})
app.get("/user/data",userAuth,(req,res)=>{
    throw new Error()
    res.send("This is user data")
})

app.listen("3000", () => {
    console.log("Server is listening to 3000");

});
app.use("/",(err,req,res,next)=>{
    if(err){                
        res.status(500).send("Something went wrong !")
    }
});


