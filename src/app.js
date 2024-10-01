const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth")
const { connectDB } = require("./config/database")
const Users = require("./model/user")

app.use(express.json());
app.post("/signup", async (req, res) => {
    const user = new Users(req.body);
    
    try {
        await user.save();
        res.send("success")
    } catch (error) {
        res.status(400).send("Erro saving the user:" + error.message)
    }


});
//get user from email

app.get("/userEmail", async (req, res) => {
    const userEmail = req.body.email;

    try {
        const user = await Users.findOne({
            emailId: userEmail
        });
        if (!user) {
            res.status(404).send("User not found")
        }
        else
            res.status(200).send(user)
    } catch (error) {
        res.status(400).send("Something went wrong" + error.message)
    }


});
// get all the user from databse
app.get("/feed", async (req, res) => {
    try {
        const user = await Users.find();
        res.status(200).send(user)
    } catch (error) {
        res.status(400).send("Something went wrong" + error.message)
    }


});

//delete User
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await Users.findByIdAndDelete(userId);
        res.send("User deleted successfully")

    } catch (error) {
        console.log("error", error);

    }

});
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const data = req.body
    try {
        const ALLOWED_UPDATES = ["age","gender","about","skills"];
        const isUpdteAllowed = Object.keys(data).every((key)=>ALLOWED_UPDATES.includes(key));
        console.log("isAllowed user", isUpdteAllowed);
        
        if(!isUpdteAllowed){
            throw new Error("Update is not allowed !")
        }
        
        const user = await Users.findByIdAndUpdate(userId, data, {
            runValidators: true,
            returnDocument:"after"
        });
        res.send("User updated successfully" + user);

    } catch (error) {
        console.log("error", error.message);
        res.status(400).send("There was a error updating user "+ error.message)

    }
})
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
