const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../model/connectionRequest");
const Users = require("../model/user");
//Get all the pending request for the logged in user

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);
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
            message: "Data fetched successfully",
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
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ],

        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
        const data = connectionRequests.map((row) => row.fromUserId._id.equals(loggedInUser._id) ? row.toUserId : row.fromUserId);
        res.json({
            message: "Data fetched successfully",
            data: data
        });

    } catch (error) {
        res.status(400).send({ message: error.message })
    }

});

//Get data of all user : Feed API
userRouter.get("/user/feed", userAuth, async (req, res) => {    
    try {
        const loggedInUser = req.user;
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit >50 ? 50 : limit;
        limit = limit < 1 ? 1 : limit;
        page = page < 1 ? 1 : page;
        const skip = (page - 1) * limit;
        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ],
        }).select("fromUserId toUserId");
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((request) => {
            hideUsersFromFeed.add(request.fromUserId.toString());
            hideUsersFromFeed.add(request.toUserId.toString());
        })
        //$nin : not in this array , $ne means not equal to
        const allUser = await Users.find({
            $and: [
            { _id: { $nin: Array.from(hideUsersFromFeed) } },
            { _id: { $ne: loggedInUser._id.toString() } }],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);        
        res.json({
            message: "Data fetched successfully",
            data: allUser
        });

    } catch (error) {
        res.status(400).send({ message: error.message })
    }
});

//!old code

// userRouter.get("/user/feed", userAuth, async (req, res) => {
//     try {
//         const loggedInUser = req.user;
//         let page = parseInt(req.query.page) || 1;
//         let limit = parseInt(req.query.limit) || 10;
//         limit = limit >50 ? 50 : limit;
//         limit = limit < 1 ? 1 : limit;
//         page = page < 1 ? 1 : page;
//         const skip = (page - 1) * limit;
//         console.log(loggedInUser);

//         //Remove the logged in user from the list
//         // let allUserExceptLoggedIn = allUser.filter((user) => user._id.toString() !== loggedInUser._id.toString());
//         // Remove the user who are already connected with the logged in user
//         const connectionRequests = await ConnectionRequestModel.find({
//             $or: [
//                 { fromUserId: loggedInUser._id },
//                 { toUserId: loggedInUser._id }
//             ],
//         }).select("fromUserId toUserId");
//         //Remove connection Request user from allUserExceptLoggedIn
//         //old code
//         // connectionRequests.forEach((request) => {
//         //     allUserExceptLoggedIn = allUserExceptLoggedIn.filter((user) => user._id.toString() !== request.fromUserId._id.toString() && user._id.toString() !== request.toUserId._id.toString());
//         // });
//         //Set data structure is like an array but it will not allow duplicate values , it will only contain unique values
//         const hideUsersFromFeed = new Set();
//         connectionRequests.forEach((request) => {
//             hideUsersFromFeed.add(request.fromUserId.toString());
//             hideUsersFromFeed.add(request.toUserId.toString());
//         })
//         //$nin : not in this array , $ne means not equal to
//         const allUser = await Users.find({
//             $and: [{ _id: { $nin: Array.from(hideUsersFromFeed) } },
//             { _id: { $ne: loggedInUser._id } }],
//         }).select(USER_SAFE_DATA).skip(skip).limit(limit);
//         res.json({
//             message: "Data fetched successfully",
//             data: allUser
//         });

//     } catch (error) {
//         res.status(400).send({ message: error.message })
//     }
// });

module.exports = userRouter;