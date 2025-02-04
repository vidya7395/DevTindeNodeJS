const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: "Please enter the firstName",
        maxLength:50,
        minLength: 4
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String, 
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address")
            }
        }
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password")
            }
        }
    },
    age:{
        type: Number,
        min: 18,
        validate(value){
            if(value<18){
                throw new Error("The age should be less than 18")
            }
        },
        
    },
    gender:{
        type: String,
        enum:{
            values:["male","female","others"],
            message :`{VALUE} is not a valid gender type`
        }
    },
    about:{
        type:String,
        default: " this is the about of the user!"  
    },
    photoUrl :{
        type: String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfGUTrUMDG6phH5gx8RpKS0FGpmr1dpHsaZg&s",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL")
            }
        }
    },
    skills:{
        type: [String],
        validate(value){
            if(value.length > 5){
                throw new Error("Only 5 skills can be added")
            }
        }
    },
    isPremium:{
        type:Boolean,
        default: false
    },
    membershipType:{
        type:String,
    },

}, {timestamps: true});

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", { expiresIn: "1d" });
    return token;
}
userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const isValidated =  await bcrypt.compare(passwordInputByUser, user.password);
    return isValidated;
}

const Users = mongoose.model("Users", userSchema);
module.exports = Users;