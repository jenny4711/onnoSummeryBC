
const express = require('express');
const router = express.Router();
const authController=require('../controllers/auth.controller')
const userController = require('../controllers/user.controller');
router.post('/signup',userController.createUser)
router.post("/chrome",userController.authChromeSignUp);
router.get('/tk',authController.authenticate,userController.getUser)
router.post('/',userController.authSignUp)
router.put('/addRef/:userId/:refEmail',userController.editMyRef)
router.delete("/:id",userController.deleteUser)
router.post("/subcredit",userController.subtractCredit)
router.put("/editLang/:id",userController.editLang)
router.put("/editPromptStyle/:id",userController.editPromptStyle)
router.get('/getUser/:email',userController.getUserIOS)



module.exports = router;