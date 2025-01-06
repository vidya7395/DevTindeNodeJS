const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
requestRouter.post("/sendConnectionRequest", userAuth, async(req,res)=>{
    const user = req.user;
    console.log("Sending a connection request to user with object:",+user);
    
    res.send("Connection request !")
});

module.exports = requestRouter;