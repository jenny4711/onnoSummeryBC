const MyHistory = require('../model/MyHistory')
const myHistoryController={};
const mongoose = require('mongoose')
const User = require('../model/User')
const History = require('../model/History')

myHistoryController.saveHistory = async (req, res) => {
  try {
    const { historyId, userEmail } = req.body;

    // ObjectId 유효성 검사
    if (!mongoose.Types.ObjectId.isValid(historyId)) {
      return res.status(400).json({ message: 'Invalid historyId' });
    }

    // 사용자 유효성 검사
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // historyId에 해당하는 기록 찾기
    const findHistory = await History.findById(historyId);
    if (!findHistory) {
      return res.status(404).json({ message: 'History not found' });
    }

    // 중복 검사
    const checkHistory = await MyHistory.findOne({ historyId, userEmail });
    if (checkHistory) {
      return res.status(200).json({ message: 'Already have it', data: checkHistory });
    }

    // 새로운 기록 저장
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

module.exports=myHistoryController;