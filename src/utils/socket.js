const socket = require("socket.io")
const Chat = require("../models/chat")

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        }
    })

    io.on("connection", (socket) => {
        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const roomId = [userId, targetUserId].sort().join("_");
            console.log(firstName+" Joined the Room : "+roomId);
            socket.join(roomId);
        })
        socket.on("sendMessage",async ({firstName,lastName,userId,targetUserId,text}) => {
            try{
                const roomId = [userId, targetUserId].sort().join("_");

                let chat = await Chat.findOne({
                    participants:{$all : [userId,targetUserId]}
                })

                if(!chat){
                    chat = new Chat({
                        participants:[userId,targetUserId],
                        messages:[]
                    })
                }

                chat.messages.push({
                    senderId:userId,
                    text,
                })

                await chat.save();
                io.to(roomId).emit("messageReceived",{userId,firstName,lastName,text});
            }
            catch(err){
                console.error("ERROR : "+err.message);
            }
        })
        socket.on("disconnect", () => { })
    })
}

module.exports = initializeSocket;