const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/Auth")

requestRouter.post("/sendConnectionRequest", userAuth ,async(req,res)=>{
    try{
        // res.send("request send")
        const user = req.user;

        res.send(`${user.firstName} has sent the connection request`);

    }catch(err){
        res.status(400).send("Error")
    }
})





module.exports = requestRouter;