const mongoose = require("mongoose");

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
        unique: true
    },
    password:{
        type: String
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
        enum:["male","female","others"]
    },
    about:{
        type:String,
        defualt: " this is the about of the user!"  
    },
    photoUrl :{
        type: String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfGUTrUMDG6phH5gx8RpKS0FGpmr1dpHsaZg&s"
    },
    skills:{
        type: [String]
    }

}, {timestamps: true});

const Users = mongoose.model("Users", userSchema);
module.exports = Users;