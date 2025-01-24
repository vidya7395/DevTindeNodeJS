const mongoose = require('mongoose');

const connectionRequestSchema = mongoose.Schema({
    fromUserId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
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
//To make query faster
connectionRequestSchema.index({fromUserId:1,toUserId:1});
connectionRequestSchema.pre("save", async function(next){
    const connectionRequest = this;
    //check if fromUserId and toUserId are the same
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself");
    }
    next();
});

const ConnectionRequestModel = mongoose.model("ConnectionRequestSchema",connectionRequestSchema);
module.exports = ConnectionRequestModel; 
