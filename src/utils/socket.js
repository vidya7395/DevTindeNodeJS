const socket = require("socket.io");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const { Chat } = require("../model/chat");
const { timeStamp } = require("console");
const ConnectionRequestModel = require("../model/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto
        .createHash("sha256")
        .update([userId, targetUserId].sort().join("$"))
        .digest("hex");
};

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true, // Allow cookies to be sent
        }
    });

    io.use((socket, next) => {
        console.log("🔹 Incoming socket connection...");  // Log when a new connection is attempted

        try {
            if (!socket.request.headers.cookie) {
                console.warn("⚠️ No authentication cookie found");
                throw new Error("No authentication cookie found");
            }

            const cookies = cookie.parse(socket.request.headers.cookie);
            console.log("🍪 Parsed cookies:", cookies); // Log cookies to check if token exists

            const token = cookies.token; // Extract token from cookie

            if (!token) {
                console.warn("⚠️ Authentication token missing in cookies");
                throw new Error("Authentication error");
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("✅ Authentication successful for user:", decoded._id);  // Log user ID

            socket.user = decoded; // Attach user data to socket
            next(); // Proceed with the connection

        } catch (error) {
            console.error("❌ Socket authentication failed:", error.message);
            return next(new Error("Unauthorized"));
        }
    });


    io.on("connection", (socket) => {
        console.log(`🟢 User connected: ${socket.user._id}`);

        socket.on("joinChat", ({ userId, targetUserId, firstName }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            socket.join(roomId);
            console.log(`👤 ${firstName} joined room: ${roomId}`);
        });

        socket.on("sendMessage", async ({ userId, targetUserId, firstName, text }) => {

            //Save message to the database
            try {
                const roomId = getSecretRoomId(userId, targetUserId);
                console.log(`📩 Message from ${firstName}: "${text}"`);
                const isUserFriends = await ConnectionRequestModel.findOne({
                    $or:[
                        { fromUserId: userId ,toUserId:targetUserId,status:"accepted"},
                        { fromUserId: targetUserId ,toUserId:userId,status:"accepted"}
                    ]
                }).select("fromUserId toUserId");
                console.log("isUserFriends",isUserFriends);
                if(isUserFriends){
                //find chat from database
                let chat = await Chat.findOne({
                    participants: {
                        $all: [userId, targetUserId]
                    }
                });
                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    })
                }
                chat.messages.push({
                    senderId: userId,
                    text,
                })
                await chat.save();
                io.to(roomId).emit("messageReceived", { firstName, text, timeStamp: new Date() })
            }
            else{
                throw new Error("This is a bridge to security")
            }
            }
            catch (err) {
                console.log("err", err);

            }
        });
        socket.on("typing", ({  userId,targetUserId ,firstName}) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            io.to(roomId).emit("userStartTyping",{firstName})
            console.log("yesTyping",firstName);
            
        });
    
        socket.on("stopTyping", ({userId, targetUserId,firstName }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            io.to(roomId).emit("userStoppedTyping",{firstName})
            console.log("stop typing",firstName);
        });
    
        socket.on("disconnect", () => {
            console.log(`🔴 User disconnected: ${socket.user?.userId || "unknown"}`);
        });
    });

};

module.exports = initializeSocket;
