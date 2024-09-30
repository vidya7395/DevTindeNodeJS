const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth")
const { connectDB } = require("./config/database")
const Users = require("./model/user")

app.use(express.json());
app.post("/signup", async(req, res) => {    
    const user = new Users(req.body);
    try {
     await user.save();
     res.send("success")
   } catch (error) {
    res.status(400).send("Erro saving the user:" +error.message)
   }


});

connectDB()
    .then(() => {
        console.log("Database connection establish");
        app.listen("3000", () => {
            console.log("Server is listening to 3000");

        });

    })
    .catch((error) => {
        console.log("Database cannot be connected");

    })
