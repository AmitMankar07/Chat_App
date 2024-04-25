const express=require('express');

const router=express.Router();

const chatController = require("../controllers/chatController");
const groupController=require('../controllers/groupController');
const userAuthentication = require("../middleware/auth");


router.post("/createGroup", userAuthentication, groupController.createGroup);

// Route to fetch user's groups
router.get('/getUserGroups', userAuthentication, groupController.getUserGroups);

module.exports=router;