const express=require('express');

const router=express.Router();

const chatController = require("../controllers/chatController");


const userAuthentication = require("../middleware/auth");

router.post("/sendMessage", userAuthentication, chatController.sendMessage);

// Route for fetching messages
router.get("/getMessages", chatController.getMessages);

router.get("/groups/:groupId/messages", chatController.getMessagesByGroup); // New route for fetching messages by group

module.exports=router;