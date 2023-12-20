const express = require('express')
const userAuthenticate = require('../middleware/auth')

const router = express.Router()

const purchageController = require("../controllers/purchageController")

router.get("/get-premium", userAuthenticate.authenticate, purchageController.getPremium)

router.get("/leaderboard", userAuthenticate.authenticate, purchageController.getLeaderBoardData)

router.post("/updatepayment", userAuthenticate.authenticate, purchageController.updatePayment)







module.exports = router