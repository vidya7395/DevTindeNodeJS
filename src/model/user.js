const mongoose = require("mongoose");
const validtor = require('validator');

const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        maxLenght:50,
        minLenght: 4
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
            if(!validtor.isEmail(value)){
                throw new Error("Invalid email address")
            }
        }
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if(!validtor.isStrongPassword(value)){
                throw new Error("Enter a strong password")
            }
        }
    },
    age:{
        type: Number,
        minm: 18,
        validate(value){
            if(value<18){
                throw new Error("The age should be less than 18")
            }
        },
        
    },
    gender:{
        type: String,
        enum:["male","female","others"]
    },
    about:{
        type:String,
        defualt: " this is the about of the user!"  
    },
    photoUrl :{
        type: String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfGUTrUMDG6phH5gx8RpKS0FGpmr1dpHsaZg&s",
        validate(value){
            if(!validtor.isURL(value)){
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
    }

}, {timestamps: true});

const Users = mongoose.model("Users", userSchema);
module.exports = Users;