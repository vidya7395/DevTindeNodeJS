const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const Users = require("../model/user")
const bcrypt = require("bcrypt");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (error) {
        res.status(400).send("Error " + error.message)
    }
});



profileRouter.patch("/user/:userId", userAuth, async (req, res) => {
    const userId = req.params.userId;
    const data = req.body
    try {
        const ALLOWED_UPDATES = ["firstName", "lastName", "age", "gender", "about", "skills"];
        const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));
        if (!isUpdateAllowed) {
            throw new Error("Update is not allowed !")
        }

        const user = await Users.findByIdAndUpdate(userId, data, {
            runValidators: true,
            returnDocument: "after"
        });
        res.send("User updated successfully" + user);

    } catch (error) {
        console.log("error", error.message);
        res.status(400).send("There was a error updating profile " + error.message)

    }
});
profileRouter.patch("/resetPassword/:userId", userAuth, async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;
    console.log("data", data);

    try {
        const ALLOWED_UPDATES = ["password", "newPassword"];
        const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));
        if (!isUpdateAllowed) {
            throw new Error("Update is not allowed !")
        }
        console.log("userID", userId);

        const user = await Users.findById(userId);
        console.log("usr", user);
        if (!user) throw new Error("user not found");
        const isPasswordValid = await user.validatePassword(data.password);
        if (!isPasswordValid) throw new Error("Invalid Credentials")
        else {
            const passwordHash = await bcrypt.hash(data.newPassword, 10);
            const user = await Users.findByIdAndUpdate(userId, { password: passwordHash }, {
                runValidators: true,
                returnDocument: "after"
            });
            await user.save();
            res.send("success")
        }


    } catch (error) {
        console.log("error", error.message);
        res.status(400).send("There was a error resetting password " + error.message)

    }
});


profileRouter.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await Users.findByIdAndDelete(userId);
        res.send("User deleted successfully" + user)

    } catch (error) {
        console.log("error", error);

    }

});
// get all the user from database
profileRouter.get("/feed", async (req, res) => {
    try {
        const user = await Users.find();
        res.status(200).send(user)
    } catch (error) {
        res.status(400).send("Something went wrong" + error.message)
    }


});


module.exports = profileRouter;