const sequelize = require("../util/db");
const Sequelize = require("sequelize");
const User = require("./user"); // Import the User model

const Chat = sequelize.define("chats", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  message: {
    type: Sequelize.STRING,
  },
});

Chat.belongsTo(User, { foreignKey: 'userId' }); // Each chat message belongs to a user


module.exports = Chat;