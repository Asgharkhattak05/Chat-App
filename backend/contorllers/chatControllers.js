const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const { request } = require("express");

const accessChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param are not  sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("lastMessage");

  isChat = await User.populate(isChat, {
    path: "lastestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = expressAsyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "lastMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroup = expressAsyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(404).send({ message: "Please Fill all the Fields..." });
  }
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form the group chat");
  }

  users.push(req.user);

  try {
    const groupchat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user._id,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupchat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = expressAsyncHandler(async(req, res)=>{
const  {chatId, chatName} = req.body;

const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {chatName:chatName},
    {new:true}
)
.populate("users", "-password")
.populate("groupAdmin", "-password");
if(!updatedChat){
    res.status(400)
    throw new Error("Chat not found");
} else{
res.json(updatedChat)}
})

const addToGroup=expressAsyncHandler(async(req, res)=>{
    const {chatId , userId} =req.body;
    const added =await Chat.findByIdAndUpdate(
        chatId,
        {$push : { users:userId },},
        {new: true},
    ).populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!added){
        res.status(400)
        throw new Error("Chat not found");
    }
    else{
    res.json(added)}

})

const removeFromGroup= expressAsyncHandler(async(req, res)=>{
  const {chatId , userId} = req.body;
  const removed =await Chat.findByIdAndUpdate(
    chatId,
    { $pull : { users : userId } },
    {new : true}
  ).populate("users" ,  "-password")
   .populate("groupAdmin", "-password")

   if(!removed){
    res.status(400)
    throw new Error("Chat not found")
   } else {
    res.json(removed)
   }
})
module.exports = { accessChat, fetchChats, createGroup, renameGroup , addToGroup , removeFromGroup };
