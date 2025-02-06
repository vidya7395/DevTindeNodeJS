const mongoose = require("mongoose");
const Users = require("./user");

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users,
        required: true,
    },
    text: {
        type: String,
        required: true
    }
}, { timeStamps: true })

const chatSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Users,
            required: true
        }
    ],
    messages: [messageSchema]
})
const Chat = mongoose.model("Chat", chatSchema);
module.exports = { Chat };