const expenseModel=require('../models/expense');
const userModel=require('../models/user');

function isstringinvalid(string){
    if(string==undefined||string.length==0){
        return true;
    } 
    return false;
}

exports.getAllExpense=async(req, res, next)=>{
    try{
        const page= +req.query.page||1;
        const ITEMS_PER_PAGE= +req.query.size;
        const totalitems=await expenseModel.count({'user.userId':req.user._id});
        const data=await expenseModel.find({'user.userId':req.user._id}).limit(ITEMS_PER_PAGE).skip((page-1) * ITEMS_PER_PAGE);
        res.status(201).json({
            size:ITEMS_PER_PAGE,
            expenseData:data,
            currentPage:page,
            hasNextPage:ITEMS_PER_PAGE * page<totalitems,
            nextPage:page+1,
            hasPreviousPage:page>1,
            previousPage:page-1,
            lastPage:Math.ceil(totalitems/ITEMS_PER_PAGE)
            });
    }
    catch(err){ 
        res.status(500).json({error:err,success:false});
    }   
}; 

exports.postAddExpense=async(req, res, next)=>{
    try{ 
        const amount=req.body.amount;
        const desc=req.body.description;
        const category=req.body.category;
        if(isstringinvalid(amount)||isstringinvalid(desc)||isstringinvalid(category))
        {
            return res.status(400).json({err:'Bad parameters.something is missing'});
        }
        const data= await expenseModel.create({amount:amount,description:desc,category:category,user: {name: req.user.name,userId: req.user }});
        const user=await userModel.findById(req.user._id);
        user.totalexpense=user.totalexpense + +amount;
        await user.save();
        res.status(201).json({newExpenseData:data,success:true,});
    }
    catch(err){ 
        console.log(err); 
        res.status(500).json({error:err,success:false});
    }
    
}
 
exports.postDeleteExpense=async(req,res,next)=>{
    try{
        
        const uId=req.params.id;
        const expenseDetails=await expenseModel.findById(uId);
       if(req.user._id.toString()===expenseDetails.user.userId.toString()){
            const user=await userModel.findById(req.user._id)
            user.totalexpense=user.totalexpense - +expenseDetails.amount;
            await user.save();
            await expenseModel.findByIdAndRemove(uId); 
            res.sendStatus(200);  
       } 
       else{
            throw new Error('Access not available');
       }   
    }
    catch(err){
        res.status(500).json({error:err.message,success:false});
    }
};