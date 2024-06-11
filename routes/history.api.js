const express =require('express')
const router=express.Router();
const historyController =require('../controllers/history.controller')

router.post('/',historyController.makeSummary)








module.exports=router;