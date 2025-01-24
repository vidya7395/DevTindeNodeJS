const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const Users = require("../model/user");
const requestRouter = express.Router();
requestRouter.post(`/request/send/:status/:toUserId`, userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type" + status
      })
    }
    //check if toUserId exists 
    const ifToUserIdExists = await Users.findById(toUserId);
    if (!ifToUserIdExists) return res.status(400).json({
      message: "User not found!"
    })
    //  if(toUserId == fromUserId){
    //   return res.status(400).json({
    //       message: "Invalid Object Id"
    //   })
    //  }
    // If there is an existing ConnectionRequest
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ],

    });

    if (existingConnectionRequest) {
      return res.status(400).json({
        message: "Connection request already exists"
      })
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });


    const data = await connectionRequest.save();
    res.json({
      message: status === "interested" ? `${req.user.firstName} is interested  in ${ifToUserIdExists.firstName}` : `${req.user.firstName} has ignored the ${ifToUserIdExists.firstName}`,
      data
    })

  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

requestRouter.post(`/request/review/:status/:requestId`, userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const status = req.params.status;
    const requestId = req.params.requestId;
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type" + status
      })
    }
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status: "interested"
    });
    if (!connectionRequest) {
      return res.status(400).json({
        message: "Invalid request"
      })
    }
    connectionRequest.status = status;
    await connectionRequest.save();
    res.json({
      message: `Request has been ${status}`,
      connectionRequest
    });

  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

module.exports = requestRouter;