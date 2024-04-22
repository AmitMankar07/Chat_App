const express=require('express');
const {postSignUp}=require('../controllers/users')
const bcrypt=require('bcrypt');
const router=express.Router();
router.post('/signup',postSignUp);

module.exports=router;