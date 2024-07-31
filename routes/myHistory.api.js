const express =require('express')
const router=express.Router();
const myHistoryController =require('../controllers/myHistory.controller')
router.post('/',myHistoryController.saveHistory)
router.get('/:userEmail',myHistoryController.showMyHistory)
router.delete('/:id',myHistoryController.deleteMyHistory)
router.delete('/all/:email',myHistoryController.deleteAllMyHistoryList)
module.exports=router;