const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/Auth")
const {UserModel} = require("../models/User");


profileRouter.get("/profile", userAuth ,async (req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(400).send("Something is wrong" + err.message);
    }
})

profileRouter.patch("/profile/:userId",async(req,res)=>{
    try{
        const userId = req.params?.userId;

        const data = req.body;

        const ALLOWED_UPDATES = ["firstName","phototUrl","gender","age","skills"];

        const isUpdatedAllowed = Object.keys(data).every((k)=> ALLOWED_UPDATES.includes(k));

        if(!isUpdatedAllowed){
            throw new Error("Update not Allowed");
        }

        if(data?.skills?.length>10){
            throw new Error("Skills cannot more than 10");
        }

        await UserModel.findByIdAndUpdate({_id:userId},data,{ runValidators:true })

        res.send("Updated Sucessfuly")
    }
    catch(err){
        res.status(400).send("Error : "+ err.message);
    }
    
})

module.exports = profileRouter;