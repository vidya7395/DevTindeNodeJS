const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel  = require("../model/connectionRequest");
//Get all the pending request for the logged in user

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;        
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId",USER_SAFE_DATA);
        // .populate("fromUserId",["firstName","lastName","photoUrl"]);
        // !This is the bad way (looping) we should use ref connection between two tables
        // const requestUsers = [];
        //Get the user details of the request
        // for (let i = 0; i < connectionRequests.length; i++) {
        //     const request = connectionRequests[i];
        //     const user = await Users.findById(request.toUserId);
        //     requestUsers.push(user);
        // }

        // if (requestUsers.length === 0) {
        //     return res.status(200).json({
        //         message: "No requests found"
        //     })
        // }
       
        res.json({
            message:"Data fetched successfully",
            data: connectionRequests
        })
    } catch (error) {
        res.status(400).send("Error " + error.message);
    }

});
//Get all the pending request sent by the logged in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
           $or: [
            { fromUserId: loggedInUser._id,status: "accepted" },
            { toUserId: loggedInUser._id,status: "accepted" }
           ],
            
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA); 
        console.log(loggedInUser._id.toString());
        
        const data = connectionRequests.map((row) => row.fromUserId._id.equals(loggedInUser._id) ? row.toUserId : row.fromUserId);
        res.json({
            message:"Data fetched successfully",
            data: data
        });

    } catch (error) {
        res.status(400).send({message:error.message})
    }

});

module.exports = userRouter;