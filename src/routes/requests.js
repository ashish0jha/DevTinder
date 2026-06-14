const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/Auth")
const conncetionRequestSchema = require("../models/connectionRequest")
const {UserModel} = require("../models/User")

requestRouter.post("/request/send/:status/:receiverId", userAuth ,async(req,res)=>{
    try{
        const senderId=req.user._id;
        const receiverId = req.params.receiverId;
        const status = req.params.status;

        const ALLOWED_STATUS = ["Interested","Ignored"];
        if(!ALLOWED_STATUS.includes(status)){
            throw new Error("Invalid status of request");
        }

        const receiver = await UserModel.findById(receiverId);

        if(!receiver){
            res.status(404).send("User not found");
        }
        
        if(req.user._id.equals(receiver._id)){
            throw new Error("User Can't request to itsellf");
        }

        const isCrossConnection = await conncetionRequestSchema.findOne({
            $or:[
                {senderId,receiverId},
                {senderId : receiverId, receiverId:senderId}
            ]
        })
        if(isCrossConnection){
            throw new Error("Request already Exist");
        }

        const newRequest =await new conncetionRequestSchema({
            senderId,
            receiverId,
            status,
        })

        await newRequest.save();

        res.send(`${req.user.firstName} sends request to ${receiver.firstName}`)

    }catch(err){
        res.status(400).send("Error : "+ err.message)
    }
})





module.exports = requestRouter;