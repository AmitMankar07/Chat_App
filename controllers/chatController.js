const path = require("path");
const User = require("../models/user");
const Chat = require("../models/chats");
const { Op } = require('sequelize'); // Import Op from Sequelize
// const sequelize = require("../util/db");
// Your existing code
const Group=require('../models/group');


const sequelize = require("../util/db");
exports.sendMessage = async (req, res, next) => {
    try {
    
    
    const groupName = req.body.groupName;
    console.log("Group Name:", groupName);
    if (!groupName) {
      throw new Error("Group name is not provided");
  }
    const group = await Group.findOne({
      where: { name: groupName },
    });
    if (!group) {
      throw new Error("Group not found");
    }
      await Chat.create({
        name: req.user.name,
        message: req.body.message,
        userId: req.user.id,
        // groupId: group ? group.id : null,
        groupId: group.dataValues.id,
      });
      console.log("chat:",Chat);
      return res.status(200).json({ message: "Success!" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Error" });
    }
  };
  
  
exports.getMessages = async (req, res, next) => {
 
  try {
    const latestMessageId = req.query.latestMessageId || 0; // Get latest message ID from query parameter, default to 0
    // Fetch messages from the database with IDs greater than the latest message ID
    const messages = await Chat.findAll({
      where: {
        id: {
          [Op.gt]: latestMessageId // Filter messages by ID greater than the latest message ID
        }
      }
    });
    // Send the messages as a response
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMessagesByGroup = async (req, res, next) => {
  try {
      const groupId = req.params.groupId;
      console.log(groupId);

      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }
      const messages = await Chat.findAll({
          where: { groupId: groupId }
      });
console.log("messages",messages);
      res.status(200).json({ messages });
  } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};
