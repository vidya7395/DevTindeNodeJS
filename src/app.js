const express = require("express");
const app = express();


app.use("/test",(req,res)=>{
    res.send("This is the response from a server, Hi Vidhya 🚀")
})
app.listen("3000",()=>{
    console.log("Server is listening to 3000");
    
})


