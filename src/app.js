const express = require("express");
const app = express();

app.get("/user",(req,res)=>{
    res.send({
        "firstName":"Vidya"
    })
})
app.post("/user",(req,res)=>{
    res.send("save data to databse")
})

app.delete("/user",(req,res)=>{
    res.send("user data deleted from databse")
})

app.use("/",(req,res)=>{
    res.send("404 resource not found 🚫 ")
})
app.listen("3000",()=>{
    console.log("Server is listening to 3000");
    
})


