const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


const postSignUp=async(req,res,next)=>{
    try{
        const {name,email,password}=req.body;
       console.log("{name,email,password}:",{name,email,password});
       
       if (!name || !email || !password) {
           res.status(400).json({ message: 'Name, email, and password are required' });
           return;
         }
         // Check if the email id already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Email id already exists' });
      return;
    }
         const hashedPassword=await bcrypt.hash(password,10);

       
         const user = await User.create({ name, email, password:hashedPassword});
         console.log("User created:", user);
         res.status(201).json(user);
      
     
   }catch(error){
       console.error(error);
       res.status(500).json({message:error.message});

   }
};
const generateAccessToken=(id,name,ispremiumuser)=>{
return jwt.sign({userId:id,name:name,ispremiumuser},'secretkey');
}
module.exports={postSignUp,generateAccessToken};
