const express = require('express');
const router = express.Router();
const userApi = require('./user.api');
const historyApi = require('./history.api');
const myHistoryApi = require('./myHistory.api');
router.use("/myHistory",myHistoryApi);
router.use("/history",historyApi);
router.use("/user",userApi);




module.exports = router;