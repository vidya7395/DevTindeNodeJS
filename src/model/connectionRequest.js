const mongoose = require('mongoose');

const connectionRequestSchema = mongoose.Schema({
    fromUserId:{
        type : mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type : mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type :String,
        required:true,
        enum :{
            values:["ignored","interested","accepted","rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
{ 
    timestamps : true
}
);
const ConnectionRequestModel = mongoose.model("ConnectionRequestSchema",connectionRequestSchema);
module.exports = ConnectionRequestModel; 