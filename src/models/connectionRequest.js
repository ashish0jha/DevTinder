const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status: {
        type: String,
        required:true,
        enum: {
            values : ["Accepted", "Rejected", "Interested", "Ignored"],
            message : `{VALUE} cannot be stored`
        }
    }
}, { timestamps: true })

connectionRequestSchema.index({senderId : 1,receiverId : 1 })

// connectionRequestSchema.pre("save",function(next){
//     const request = this;
//     if(request.receiverId.equals(request.senderId)){
//         throw new Error("User can't send request to itself");
//     }
//     next();
// })

const ConnectionRequestSchemaModel = new mongoose.model("connectionRequestSchema",connectionRequestSchema);

module.exports = ConnectionRequestSchemaModel;