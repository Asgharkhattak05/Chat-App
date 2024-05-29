const mongoose = require("mongoose");
const { chats } = require("../data/data");
const Chat = require("./chatModel");

const  messageModel =  mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:String,
        required:true,
        trim:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Chat
    },

}, {setTimeout:true})

const Message = mongoose.model("Message", messageModel)
module.exports = Message;