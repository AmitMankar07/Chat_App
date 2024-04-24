const path = require("path");
const User = require("../models/user");
const Chat = require("../models/chats");

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
  