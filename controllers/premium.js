const userModel=require('../models/user');

exports.getLeaderboard=async(req,res,next)=>{
        try{
                const lboardDetails=await userModel.find({},'_id name totalexpense').sort( { totalexpense: -1 } );
                res.status(200).json(lboardDetails);
        }
        catch(err){
            console.log(err);
            res.status(500).json({err}); 
        }
}