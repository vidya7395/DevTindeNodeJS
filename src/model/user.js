const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String
    },
    password:{
        type: String
    },
    age:{
        type: String
    },
    gender:{
        type: String
    }
});

const Users = mongoose.model("Users", userSchema);
module.exports = Users;