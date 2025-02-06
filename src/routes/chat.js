const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../model/chat");
const chatRouter = express.Router();

chatRouter.get('/chat/:targetUserId', userAuth, async (req, res) => {
    const targetUserId = req.params.targetUserId;
    const userId = req.user._id;
    try {
        let chat = await Chat.findOne({
            participants: {
                $all: [userId, targetUserId]
            }
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName"
        })
        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],

            })
            await chat.save();
        }
        res.json(chat);
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({
            message: error.message
        })
    }
})
module.exports = chatRouter;