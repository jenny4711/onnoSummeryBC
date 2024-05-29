
const userController={};
require('dotenv').config();
const axios = require('axios');
const {OAuth2Client} = require('google-auth-library');
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const GOOGLE_CLIENT_ID =process.env.GOOGLE_CLIENT_ID
const GOOGLE_CHROME_CLIENT_ID =process.env.GOOGLE_CHROME_CLIENT_ID
const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY;
userController.createUser = async (req, res) => {
  try{
  const {email,firstName,lastName,picture,credit}=req.body;
  const user = await User.findOne({email});
if(user)throw new Error('You already Have an account')
  const randomPassword = ""+Math.floor(Math.random()*1000000000);
const salt = await bcrypt.genSalt(10)
const newPassword = await bcrypt.hash(randomPassword,salt)
  const newUser = new User({
    email,
    fullName:firstName,
    password:newPassword,
    picture,
    credit,
  });
  await newUser.save();
  console.log(newUser,'newUser!!')
  const sessionToken = await user.generateToken();
  res.status(200).json({status:'success',data:newUser,token:sessionToken})



 

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
    res.status(400).json({status:'fail',error:error.message})
  }
}

userController.authSignUp=async(req,res)=>{
  try{
    const { fullName, picture, credit, lang, promptStyle, token } = req.body;
    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket= await googleClient.verifyIdToken({
      idToken:token,
      audience:GOOGLE_CLIENT_ID
    })
    const {email,name}=ticket.getPayload();
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
        credit:20,
        lang,
        promptStyle,
      });
      await user.save();

    }
    const sessionToken = await user.generateToken();
    res.status(200).json({status:'success',user,token:sessionToken})

  }catch(error){
    res.status(400).json({status:'fail',error:error.message})
  }
}

userController.authChromeSignUp=async(req,res)=>{
  try{
    const { fullName, picture, credit, lang, promptStyle, token } = req.body;
    console.log(token,'token!!!!!')
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
    console.log(response,'response!!!!!!!!!!!!!!!!!')
    return res.status(400).json({status:'fail',error:'Invalid token'})
  }
  const data = await response.json();
  console.log(data,'data!!!!!!!!!!!!!!!!!') 
  const {email,name}=data;
   console.log(email,'email!!!!!!!!!!!!!!!!!') 
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
    console.log(user,'user!!!!!!!!!!!!!!!user')
    const sessionToken = await user.generateToken();
    console.log(sessionToken,'sessionToken')
   
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
        res.status(400).json({ status: 'You have over limit now. Please recharge credit!' });
      }
    }
  } catch (error) {
    console.log(error, "error!!!!!!!!!!!");
    return res.status(400).json({ status: 'You need to register first', error: error });
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

userController.editMyRef=async(req,res)=>{
  try{
    const _id = req.params.userId;
    const friend = req.params.refEmail;
    const user = await User.findOne({_id})
    const checkUser = await User.findOne({email:friend})
   
    if(checkUser || user.myRef.includes(friend)){
      return res.status(400).json({message:'you already added it'})
    }else{
      user.myRef.push(friend)
      await user.save();
      return res.status(200).json({message:'addRef is saved'})
    }
   

  }catch(error){
    console.log(error,'editMyRef!')
    return res.status(400).json({message:'you already added it',error})
  }
}

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