const jwt=require('jsonwebtoken');
const User=require('../models/user');

const authenticate=async(req,res,next)=>{
    

    try {
        console.log("in middleware auth");

        // // Check if token is already set in localStorage
        // const user = req.session.user;
        
        const token = req.header('Authorization');
console.log("in auth token",token);
    // Check if token is missing
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token missing.' });
    }
        // Verify the token using the secret key
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.userId;
        console.log("token in auth:",decodedToken);
        console.log('userID>>>>',userId);
          // Check if user exists
          const user = await User.findByPk(userId);
          req.user=user;
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
         // Attach the user object to the request
         req.user = user;
        console.log("auth done and sedn to next")
         // Continue to the next middleware
         next();

    
    } catch (error) {
       
        console.log("errror in auth:",error)
        // If token is invalid, return an error response
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports=authenticate;