const User = require('./model/User');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const indexRouter = require('./routes/index');
const cron = require('node-cron');
require('dotenv').config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());
app.use('/zs', indexRouter);
const mongoURI = process.env.LOCAL_DB_ADDRESS;
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB Connected'))
.catch((err)=>console.log('DB connection fail',err));


// -------------------------------------------


//--------------------------------------------------
cron.schedule('58 23 * * *',async () => {
    console.log('크론 작업이 실행되었습니다.');
    console.log(new Date().toString());
    try{
      const user = User.find({status:'free'})
     
      if(user){
        await user.updateMany({},{$set:{credit:10}});
        await user.updateMany({},{$set:{defaultCredit:10}});
        console.log('모든 사용자의 크레딧이 성공적으로 업데이트되었습니다.');
        console.log(user,'user')
        console.log(new Date().toString());
      }else{
        console.log(user,'all status')
      }
  
  
    }catch(error){
      console.error('크레딧 업데이트 중 에러가 발생했습니다:', error);
    }
  },{
    scheduled: true,
    timezone: "America/New_York" 
  });
  //------------------------------------------
  
  cron.schedule('59 23 * * *', async () => {
    console.log('크론 작업 extra credit이 실행되었습니다.');
    try {
      const allUsers = await User.find({});

      const user = await User.find({status:'free'})
      if(user){
        await user.updateOne({},{$set:{credit:user.credit+(user.myRef.length * 5)}});
        await user.updateOne({},{$set:{defaultCredit:user.credit+(user.myRef.length * 5)}});
      }

      // allUsers.filter((user)=>{
      //   if(user.myRef && user.myRef.length>0){
          
      //     user.credit = user.credit  + (user.myRef.length * 5);
      //     user.defaultCredit = user.credit + (user.myRef.length * 5);
      //     console.log(`${user._id}의 크레딧이 ${user.myRef.length * 5}만큼 추가되었습니다.`);
      //   }

      // })
      
      // for (let user of allUsers) {
      //   if (user.myRef && user.myRef.length > 0) {
      //     await User.updateOne({ _id: user._id }, { $inc: { credit:10+ (user.myRef.length * 5) } });
      //     await User.updateOne({ _id: user._id }, { $inc: { defaultCredit:10+ (user.myRef.length * 5) } });
      //     console.log(`${user._id}의 크레딧이 ${user.myRef.length * 5}만큼 추가되었습니다.`);
      //   }
      // }
    } catch (error) {
      console.error('추가 크레딧 업데이트 중 에러가 발생했습니다:', error);
    }
  }, {
    scheduled: true,
    timezone: "America/New_York"
  });
  
  
  

// -------------------------------------------



app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on port 5000');
})

