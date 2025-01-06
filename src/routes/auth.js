const express = require("express");
const authRouter = express.Router();
const {validatingSignUpData} = require("../utils/validators");
const bcrypt = require("bcrypt");
const Users = require("../model/user");
const validator = require("validator");

module.exports = authRouter;
authRouter.post("/signup", async (req, res) => {

    try {
        const { firstName, lastName, password, age, emailId, gender, photoUrl } = req.body;
        validatingSignUpData(req);
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new Users({
            firstName,
            lastName,
            password: passwordHash,
            age,
            emailId,
            gender,
            photoUrl
        });
        await user.save();
        res.send("success")
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }


});
authRouter.post("/login", async (req, res) => {

    try {
        const { emailId, password } = req.body;
        if (!validator.isEmail(emailId)) throw new Error("Email is not valid");
        const user = await Users.findOne({ emailId });
        if (!user) throw new Error("Invalid credentials!");
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) throw new Error("Invalid Credentials !")


        else {
            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.send("Login Successful !")
        }

    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
});
authRouter.post("/logout", async(req,res)=>{
    try {
        res.cookie("token", null,{
            expires: new Date(Date.now())
        }).send("Logout successfully !!");
    } catch (error) {
        res.send("ERROR:" + error.message);
    }
});