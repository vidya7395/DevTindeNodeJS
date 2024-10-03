const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth")
const { connectDB } = require("./config/database")
const Users = require("./model/user")
const { validatingSignUpData } = require("./utils/validators")
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {

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

app.post("/login", async (req, res) => {

    try {
        const { emailId, password } = req.body;
        if (!validator.isEmail(emailId)) throw new Error("Email is not valid");
        const user = await Users.findOne({ emailId });
        if (!user) throw new Error("Invalid credentials!");
        const isPassowordValid = await bcrypt.compare(password, user.password);
        if (!isPassowordValid) throw new Error("Invalid Credentials !");


        else {
            //Create JWT token
            const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", { expiresIn: "1d" });
            //Add the token to cookie and send the response back
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.send("Login Successfull !")
        }

    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
});
app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (error) {
        res.status(400).send("Error " + error.message)
    }
})
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const data = req.body
    try {
        const ALLOWED_UPDATES = ["age", "gender", "about", "skills"];
        const isUpdteAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));
        if (!isUpdteAllowed) {
            throw new Error("Update is not allowed !")
        }

        const user = await Users.findByIdAndUpdate(userId, data, {
            runValidators: true,
            returnDocument: "after"
        });
        res.send("User updated successfully" + user);

    } catch (error) {
        console.log("error", error.message);
        res.status(400).send("There was a error updating user " + error.message)

    }
})

app.post("/sendConnectionRequest", userAuth,)
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
