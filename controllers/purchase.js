const Razorpay=require('razorpay')
const userModel=require('../models/user');
const jwt=require('jsonwebtoken');
require('dotenv').config();

function generateAcToken(id,name,ispremiumuser){
    return jwt.sign({userId:id,name:name,ispremiumuser},process.env.TOKEN_SECRET);
}

exports.purchasepremium=async(req,res,next)=>{
    try{
        var rzp=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })   
        const amount=2500;

        rzp.orders.create({amount,currency:"INR"},async(err,order)=>{
            try{
                if(err)
                {
                    throw new Error(JSON.stringify(err));
                }
                const user=await userModel.findById(req.user._id);
                user.order.push({
                    orderid:order.id,
                    status:'PENDING'
                });
                await user.save();
                return res.status(201).json({order,key_id:rzp.key_id});
            }
            catch(err){
                throw new Error(err);
            }
        })  
    }
    catch(err){
        res.status(403).json({message:'something went wrong in prm',error:err});
    }
}

exports.updateTransactionStatus=async(req,res,next)=>{
        try{
                if(req.body.payment_id==null){
                    const {order_id}=req.body;
                    const user=await req.user.populate('order');
                    const orderIndex = user.order.findIndex(cp => {
                        return cp.orderid.toString() === order_id.toString();
                      });
                    user.order[orderIndex].status='FAILED';
                    await user.save();
                    
                    return res.status(202).json({success:false,message:"Transaction unsuccessfull"});
                }
                const userId=req.user._id;
                const name=req.user.name
                const {payment_id,order_id}=req.body;
                const user=await req.user.populate('order');
                const orderIndex = user.order.findIndex(cp => {
                    return cp.orderid.toString() === order_id.toString();
                  });
                user.order[orderIndex].status='SUCCESSFULL';
                user.order[orderIndex].paymentid=payment_id;
                user.ispremiumuser=true;
                await user.save();

                return res.status(202).json({success:true,message:"Transaction successfull",token:generateAcToken(userId,name,true)});
        }   
        catch(err){
            console.log(err);
            res.status(403).json({message:'something went wrong',error:err});
        }
}