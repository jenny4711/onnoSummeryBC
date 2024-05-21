const express =require('express')
const router=express.Router();
const historyController =require('../controllers/history.controller')

router.post('/',historyController.makeSummary)
router.post('/article',historyController.articleSummery)







module.exports=router;