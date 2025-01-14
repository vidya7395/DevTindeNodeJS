const express = require("express");
const app = express();
const { connectDB } = require("./config/database")
const cookieParser = require('cookie-parser')
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
connectDB()
    .then(() => {
        console.log("Database connection establish");
        app.listen("3000", () => {
            console.log("Server is listening to 3000");

        });

    })
    .catch((error) => {
        console.log("Database cannot be connected"+error.message);

    })
