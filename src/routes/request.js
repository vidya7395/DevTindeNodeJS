const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest= require("../model/connectionRequest");
const Users = require("../model/user");
const requestRouter = express.Router();
requestRouter.post(`/request/send/:status/:toUserId`, userAuth, async(req,res)=>{
   try {
       const fromUserId =req.user._id;
       const toUserId = req.params.toUserId;
       const status = req.params.status;
       const allowedStatus = ["ignored", "interested"];
       if(!allowedStatus.includes(status)){
           return res.status(400).json({
            message: "Invalid status type" +status
           })
       }
       //check if toUserId exists 
       const ifToUserIdExists = await Users.findById(toUserId);
       if(!ifToUserIdExists)   return res.status(400).json({
        message: "Invalid User"
       })
       if(toUserId == fromUserId){
        return res.status(400).json({
            message: "Invalid Object Id"
        })
       }
      // If there is an existing ConnectionRequest
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or:[
            {fromUserId, toUserId},
            {fromUserId:toUserId, toUserId:fromUserId}
        ],
        
      });

      if(existingConnectionRequest) {
        return res.status(400).json({
            message: "Connection request already exists"
        })
      }
      
       const connectionRequest = new ConnectionRequest ({
        fromUserId,
        toUserId,
        status
       });
    
       const data = await connectionRequest.save();
       res.json({
        message:"Connection request send successfully!",
         data
       })
    
   } catch (error) {
    res.status(400).send("ERROR:" + error.message);
   }
});

module.exports = requestRouter;