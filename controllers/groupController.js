const path = require("path");
const User = require("../models/user");
const Group = require("../models/group");
const UserGroup = require("../models/userGroup");
const { Op } = require("sequelize");

exports.createGroup = async (req, res, next) => {
  try {
    const groupName = req.body.groupName;
    const admin = req.user.name;
    const members = req.body.members;

    const group = await Group.create({ name: groupName, admin: admin });

    const invitedMembers = await User.findAll({
      where: {
        email: {
          [Op.or]: members,
        },
      },
    });

    (async () => {
      await Promise.all(
        invitedMembers.map(async (user) => {
          const response = await UserGroup.create({
            isadmin: false,
            userId: user.dataValues.id,
            groupId: group.dataValues.id,
          });
        })
      );

      await UserGroup.create({
        isadmin: true,
        userId: req.user.id,
        groupId: group.dataValues.id,
      });
    })();

    res.status(201).json({ group: group.dataValues.name, members: members });
  } catch (error) {
    console.log(error);
  }
};



exports.getUserGroups = async (req, res, next) => {
    try {
        // Fetch groups where the user is a member
        const userId = req.user.id; // Assuming you have user information stored in req.user
        const userGroups = await UserGroup.findAll({
            where: {
                userId: userId
            },
            include: Group // Include the Group model to fetch associated group data
        });

        // Extract group data from the userGroups array
        const groups = userGroups.map(userGroup => userGroup.Group);

        // Send the groups as a response
        res.status(200).json({ groups });
    } catch (error) {
        console.error('Error fetching user groups:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
