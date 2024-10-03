const validator = require('validator');
const validatingSignUpData = (req) => {
    const {firstName , lastName,emailId,password}= req.body;
    if(!(firstName.length > 3 && firstName.length < 50)){
        throw new Error("First Name should be between 4 - 50 characters!")
    }
    if(!(validator.isEmail(emailId))){
        throw new Error("Email Id is not valid!")
    }
    if(!(validator.isStrongPassword(password))){
        throw new Error("Password should be strong!")
    }
}

module.exports = {
    validatingSignUpData
}