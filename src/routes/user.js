const express = require("express");
const userRouter = express.Router();

const {UserModel} = require("../models/User");
const { userAuth } = require("../middlewares/Auth");

userRouter.get("/user/feed",async (req, res)=>{
    try{
        const users = await UserModel.find({});
        res.send(users);
    }
    catch(err){
        res.status(400).send("Something is wrong"); 
    }
})

userRouter.delete("/user", userAuth , async (req,res)=>{
    try{
        const userId = req.user._id;

        await UserModel.findByIdAndDelete(userId);

        res.send("user Deleted");
    }
    catch(err){
        res.status(400).send("Something is Wrong");
    }
})




module.exports = userRouter;