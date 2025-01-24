const express = require("express");
const userRouter = express.Router();
const Users = require("../model/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel  = require("../model/connectionRequest");
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const connections = await ConnectionRequestModel.find({
            toUserId: user._id
        });
        const connectionUsers = [];
        for (let i = 0; i < connections.length; i++) {
            const connection = connections[i];
            const user = await Users.findById(connection.fromUserId);
            connectionUsers.push(user);
        }
        if (connectionUsers.length === 0) {
            return res.status(200).json({
                message: "No connections found"
            })
        };
        res.status(200).json({
            connectionUsers
        })

    } catch (error) {
        res.status(400).send("Error " + error.message);
    }

});

//Get all the pending request for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        console.log("loggedInUser", loggedInUser._id);
        
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        })
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

module.exports = userRouter;