const MyHistory = require('../model/MyHistory')
const myHistoryController={};
const mongoose = require('mongoose')
const User = require('../model/User')

myHistoryController.saveHistory=async(req,res)=>{
  try{
    const{historyId, userEmail}=req.body;
    const checkHistory = await MyHistory.findOne({historyId})
    const user = await User.findOne({email:userEmail})
    console.log(historyId,'historyId')
    console.log(userEmail,'userEmailmyHistorySaveHistory!!!')
    if (!mongoose.Types.ObjectId.isValid(historyId)) {
      return res.status(400).json({ message: 'Invalid historyId format' });
    }
    if(!user) throw new Error('user not found')

    if(checkHistory){
      return res.status(200).json({message:'already have it',data:checkHistory})
    }
    const newHistory = new MyHistory({
      historyId,
      userEmail,
    });
    await newHistory.save();
  }catch(error){
    console.log(error,'error=saveMyHistory')
  }
}

myHistoryController.showMyHistory=async(req,res)=>{
  try{
    const {userEmail}=req.params
    const myHistory = await MyHistory.find({userEmail}).populate('historyId')
    
    if(!myHistory){
      return res.status(400).json({message:'you dont have any history'})
    }
    return res.status(200).json({status:'success-showMyHistory',data:myHistory})
  
  }catch(error){
    console.log(error,'error-showMyHistory')
  }
}


myHistoryController.deleteMyHistory=async(req,res)=>{
  try{
   const deletedItem=await MyHistory.findByIdAndDelete(req.params.id)
   console.log(deletedItem,'deletedItem!!!!!!!!!!!!')
    if(!deletedItem){
      return res.status(400).json({message:'not found'})
    }
    return res.status(200).json({status:'success-deleteMyHistory',data:deletedItem})
  }catch(error){
    console.log(error.message,'error-deleteMyHistory')
  }
}

module.exports=myHistoryController;