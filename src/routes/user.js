const express = require("express");
const userRouter = express.Router();

const { UserModel } = require("../models/User");
const ConnectionRequestSchema = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/Auth");

const SAFE_USER_DATA = "firstName lastName age gender photoUrl skills about";

userRouter.get("/user/requests/:state", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const state = req.params.state;

        const allowedStates = ["sent","received"];
        if(!allowedStates.includes(state)){
            throw new Error("Entered State is wrong")
        }

        const requiredFeild = (state === "sent" ? "senderId" : "receiverId");
        
        const totalRequests = await ConnectionRequestSchema.find({
            [requiredFeild]: loggedInUser._id,
            status: "Interested",
        }).populate("senderId", SAFE_USER_DATA)
            .populate("receiverId", SAFE_USER_DATA);

        const finalDataTosendFrontEnd = totalRequests.map((row)=>{
            if(state === "sent"){
                return row.receiverId;
            }
            return row.senderId;
        })

        res.send(finalDataTosendFrontEnd);
    } catch (err) {
        res
            .status(400)
            .send("Something is wrong and that something is : " + err.message);
    }
});

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const totalConnections = await ConnectionRequestSchema.find({
            $or:[
                {senderId : loggedInUser._id , status : "Accepted"},
                {receiverId : loggedInUser._id, status : "Accepted"}
            ]
        })
            .populate("senderId" , SAFE_USER_DATA)
            .populate("receiverId",SAFE_USER_DATA);

            const data = totalConnections.map((row)=>{
                if(loggedInUser._id.equals(row.senderId._id)){
                    return row.receiverId;
                }
                return row.senderId;
            })

            res.json({
                message:`You have total connection of ${data.length}`,
                data
            })
    }catch(err){
        res.status(400).send("Error : the error is : " + err.message);
    }
})


userRouter.delete("/user", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;

        await UserModel.findByIdAndDelete(userId);

        res.send("user Deleted");
    } catch (err) {
        res.status(400).send("Something is Wrong");
    }
});

module.exports = userRouter;
