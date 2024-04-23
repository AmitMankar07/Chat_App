const express=require('express');
const {postSignUp,postUserLogin}=require('../controllers/users')
const bcrypt=require('bcrypt');
const router=express.Router();

router.post('/signup',postSignUp);

router.post('/login',postUserLogin);

module.exports=router;