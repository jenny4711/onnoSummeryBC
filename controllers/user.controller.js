
const userController={};

require('dotenv').config();
const axios = require('axios');
const admin =require('../utils/firebaseAdmin');
const {OAuth2Client} = require('google-auth-library');
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const GOOGLE_CLIENT_ID =process.env.GOOGLE_CLIENT_ID
const GOOGLE_CHROME_CLIENT_ID =process.env.GOOGLE_CHROME_CLIENT_ID
const GOOGLE_RF_CLIENT_ID =process.env.GOOGLE_RF_CLIENT_ID
const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY;

userController.getUserIOS=async(req,res) => {
  try{
    const {email}=req.params;
    const user = await User.findOne({email:email});
    if(!user) throw new Error('You do not have an account')
    res.status(200).json({status:'success',user})
  }catch(error){
    console.log(error,'getUserIOS-error')
    res.status(400).json({status:'fail',error})
  }
}


userController.createUser = async (req, res) => {
  try{
    const {credit,token}=req.body;
    const googleClient = new OAuth2Client(GOOGLE_RF_CLIENT_ID);
    const ticket=await googleClient.verifyIdToken({
      idToken:token,
      audience:GOOGLE_RF_CLIENT_ID
    });
    const {email,name}=ticket.getPayload();
    console.log(ticket.getPayload(),'ticket')
console.log(email,'email')
  const user = await User.findOne({email});
if(user)throw new Error('You already Have an account')
  const randomPassword = ""+Math.floor(Math.random()*1000000000);
const salt = await bcrypt.genSalt(10)
const newPassword = await bcrypt.hash(randomPassword,salt)
  const newUser = new User({
    email,
    firstName:name,
    lastName:name,
    password:newPassword,
    picture:"",
    credit,
  });
  await newUser.save();

  res.status(200).json({status:'success',data:newUser,email})



 

  }catch(error){
    console.log(error,'createUser')
    res.status(400).json({status:'fail',error:error.message})
  }
}

userController.getUser=async(req,res)=>{
  try{
    const {userId}=req;
    const user = await User.findById(userId)
    if(user) {
      res.status(200).json({status:'success',data:user})
    }
    throw new Error('Invalid token')
  }catch(error){
    console.log(error,'getUser-error')
    res.status(400).json({status:'fail',error:error.message})
  }
}

userController.authSignUp=async(req,res)=>{
  try{
    const { fullName, picture, credit, lang, promptStyle, token } = req.body;
  
const decodedToken=await admin.auth().verifyIdToken(token);
const {email,name}=decodedToken;


    let user = await User.findOne({email});
    if(!user) {
      const randomPassword = ""+Math.floor(Math.random()*1000000000);
      const salt = await bcrypt.genSalt(10)
      const newPassword = await bcrypt.hash(randomPassword,salt)
      
      user = new User({
        fullName,
        password:newPassword,
        email,
        picture,
        credit:10,
        defaultCredit:10,
        lang,
        promptStyle,
      });
      await user.save();
      const sessionToken = await user.generateToken();
      res.status(200).json({status:'success',user,token:sessionToken})

    }
    const existingUser=await User.findOne({email})
    const sessionToken = await existingUser.generateToken();
    res.status(200).json({status:'success',user:existingUser,token:sessionToken})
 

  }catch(error){
    console.log(error,'errorUser!!!!!!!!!!!')
    res.status(400).json({status:'fail',error:error.message})
  }
}

userController.authChromeSignUp=async(req,res)=>{
  try{
    const { fullName, picture, credit, lang, promptStyle, token } = req.body;
   
  if(!token){
    return res.status(400).json({status:'fail',error:'Token is required'})
  }
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if(!response.ok){
   
    return res.status(400).json({status:'fail',error:'Invalid token'})
  }
  const data = await response.json();
  
  const {email,name}=data;
  
    let user = await User.findOne({email});
    if(!user) {
      const randomPassword = ""+Math.floor(Math.random()*1000000000);
      const salt = await bcrypt.genSalt(10)
      const newPassword = await bcrypt.hash(randomPassword,salt)
      
      user = new User({
        fullName,
        password:newPassword,
        email,
        picture,
        credit:10,
        lang,
        promptStyle,
      });
      await user.save();

    }
   
    const sessionToken = await user.generateToken();
  
   
    res.status(200).json({status:'success',user,token:sessionToken})

  }catch(error){
    console.log(error,'errorUser!!!!!!!!!!!')
    res.status(400).json({status:'fail',error:error.message})
  }
}

userController.subtractCredit = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
  
      if (user.credit > 0) {
        user.credit -= 1;
        await user.save();
        return res.status(200).json({ status: 'You have used 1 credit', data: user.credit });
      } else {
        throw new Error('You have over limit now. Please recharge credit!' );
      }
    }
  } catch (error) {
    console.log(error, "error!!!!!!!!!!!");
    return res.status(400).json({ status: 'You have over limit now. Please recharge credit!', error: error });
  }
};



userController.editLang = async (req, res) => {
  try {
    const email = req.params.id;
    const { lang } = req.body;
    const userId =await User.findOne({email})
    const user = await User.findByIdAndUpdate(
      userId,
      { lang },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ status: "Not found the User!", message: "Fail-Update-Lang" });
    }
   
    return res.status(200).json({ status: 'addLang-success', data: user });
  } catch (error) {
    console.log(error, 'error-editLang');
    return res.status(400).json({ status: "updateLang-fail", error: error });
  }
};

userController.editMyRef = async (req, res) => {
  try {
    const _id = req.params.userId;
    const friend = req.params.refEmail;
    


    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const checkUser = await User.findOne({ email: friend });

  
    if ( user.myRef.includes(friend)) {
      console.log('Friend already added:', friend);
      return res.status(400).json({ message: 'You already added it' });
    } else {
      
      user.myRef.push(friend);
      await user.save();
      console.log(user.myRef, 'current myRef');

      return res.status(200).json({ message: 'addRef is saved' });
    }
   

  } catch (error) {
    console.log(error, 'editMyRef!!!!!!!!!!!!!!!!!!!!!!!!!');
    return res.status(400).json({ message: 'An error occurred', error });
  }
};

userController.editPromptStyle = async (req, res) => {
  try {
    const email = req.params.id;
    const { promptStyle } = req.body;
    const userId =await User.findOne({email})
    const user = await User.findByIdAndUpdate(
      userId,
      { promptStyle },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: "Not found the user!", message: "Fail-update-promtStyle" });
    }
   
    return res.status(200).json({ status: 'addPromptStyle-success', data: user });
  } catch (error) {
    console.log(error, 'error-editLang');
    return res.status(400).json({ status: "updatePromptStyle-fail", error: error });
  }
};

userController.deleteUser=async(req,res)=>{
  try{
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    res.status(200).json({status:"Your account is deleted",data:deletedUser})
  }catch(error){
    console.log(error,'deleteUser-error')
    res.status(400).json({status:"delete-fail",error:error})
  }
}


module.exports = userController;