const jwt=require('jsonwebtoken');
const User=require('../models/user');
require('dotenv').config(); 

const authenticate=async(req,res,next)=>{
    try{
        const token=req.header('Authorization');
        const user=jwt.verify(token,process.env.TOKEN_SECRET);
        const output=await User.findById(user.userId);
        req.user=output;
        next();
    }
    catch(err){
        return res.status(401).json({success:false});
    }
}

module.exports={authenticate};