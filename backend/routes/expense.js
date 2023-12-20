const express = require('express')
const userAuthenticate = require('../middleware/auth')

const router = express.Router()

const expenseController = require("../controllers/expenseController")

router.get("/", userAuthenticate.authenticate, expenseController.getExpense)

router.post("/add-expense", userAuthenticate.authenticate, expenseController.addExpense)

router.put("/update-expense/:id", userAuthenticate.authenticate, expenseController.updateExpense)

router.delete("/delete-expense/:id", userAuthenticate.authenticate, expenseController.deleteExpense)

router.get("/donload", userAuthenticate.authenticate, expenseController.downloadExpense)

module.exports = router