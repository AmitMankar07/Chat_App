const path = require("path");
const User = require("../models/user");
const Chat = require("../models/chats");
const { Op } = require('sequelize'); // Import Op from Sequelize

// Your existing code


const sequelize = require("../util/db");
exports.sendMessage = async (req, res, next) => {
    try {
    //   const group = await Group.findOne({
    //     where: { name: req.body.groupName },
    //   });
  
      await Chat.create({
        name: req.user.name,
        message: req.body.message,
        userId: req.user.id,
        // groupId: group.dataValues.id,
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