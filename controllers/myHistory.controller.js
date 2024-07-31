const MyHistory = require('../model/MyHistory')
const myHistoryController={};
const mongoose = require('mongoose')
const User = require('../model/User')
const History = require('../model/History')

myHistoryController.saveHistory = async (req, res) => {
  try {
    const { historyId, userEmail } = req.body;

    
    if (!mongoose.Types.ObjectId.isValid(historyId)) {
      return res.status(400).json({ message: 'Invalid historyId' });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    const findHistory = await History.findById(historyId);
    if (!findHistory) {
      return res.status(404).json({ message: 'History not found' });
    }

  
    const checkHistory = await MyHistory.findOne({ historyId, userEmail });
    if (checkHistory) {
      return res.status(200).json({ message: 'Already have it', data: checkHistory });
    }

   
    const newHistory = new MyHistory({
      historyId,
      userEmail
    });
    await newHistory.save();

    res.status(201).json({ message: 'History saved successfully', data: newHistory });
  } catch (error) {
    console.log('Error:', error, 'error=saveMyHistory');
    res.status(500).json({ message: 'Error saving history', error: error.message });
  }
};



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
  
    if(!deletedItem){
      return res.status(400).json({message:'not found'})
    }
    return res.status(200).json({status:'success-deleteMyHistory',data:deletedItem})
  }catch(error){
    console.log(error.message,'error-deleteMyHistory')
  }
}

myHistoryController.deleteAllMyHistoryList=async(req,res)=>{
  try{
    const deletedAll=await MyHistory.deleteMany({email:req.params.email})
    if(!deletedAll){
      return res.status(400).json({message:'not found'})
    }
    return res.status(200).json({status:'success-deleteAllMyHistory',data:deletedAll})
  }catch(error){
    console.log(error.message,'error-deleteAllMyHistory')
  }
}






module.exports=myHistoryController;