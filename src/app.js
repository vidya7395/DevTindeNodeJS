const express = require("express");
const app = express();

// app.get("/ab?cd",(req,res)=>{
//     res.send("This is ab?c route")
    
// });
app.get("/ab*cd",(req,res)=>{
    res.send("This is ab*cd route")
    
});
app.get(/a/,(req,res)=>{
    res.send("This is /a/ route")
    
});
app.get(/.*fly$/,(req,res)=>{
    res.send("This is fly route")
    
});
//Reading query from route
app.get("/test",(req,res)=>{
    console.log(req.query);
    
    res.send("This is fly route")
    
});
//Reading params from route
app.get("/test/:userId",(req,res)=>{
    console.log(req.params);
    
    res.send("This is fly route")
    
});

app.listen("3000",()=>{
    console.log("Server is listening to 3000");
    
})


