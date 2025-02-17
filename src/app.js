const express = require("express");
const app = express();
const { connectDB } = require("./config/database")
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http');
require("dotenv").config();
require("./utils/cronJob.js")

app.use(cors({
    origin: "http://localhost:5173",  // Allow frontend origin
    credentials: true,                 // Allow cookies if needed
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",  // Explicitly allow PATCH,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");
const initializeSocket = require("./utils/socket.js");


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);
// Configuring for socket connection
const server = http.createServer(app);
initializeSocket(server)
connectDB()
    .then(() => {
        console.log("Database connection establish");
        server.listen("3000", () => {
            console.log("Server is listening to 3000");

        });

    })
    .catch((error) => {
        console.log("Database cannot be connected"+error.message);

    })
