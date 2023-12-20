const Expense = require('../models/expense')
const User = require('../models/user')
const FileDonload = require('../models/fileDonload')
const { uploadToS3 } = require('../services/s3Services')
const { default: mongoose } = require('mongoose')


exports.getExpense = async (req, res, next) => {
    try {
        console.log("query", req.query);
        const page = req.query.page || 1;
        const limit = +req.query.limit || 5;

        const offset = (page - 1) * limit;

        const result = await Expense.find({ UserId: req.user._id })
            .sort({createdAt:'desc'})
            .skip(offset)
            .limit(limit)
        const count = await Expense.countDocuments({UserId: req.user._id})

        res.status(200).json({
            expenses: result,
            total: count,
            currentPage: page,
            totalPages: Math.ceil(result.count / limit),
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

exports.addExpense = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const { expenseAmount, description, category } = req.body
        await Expense.create([{ expenseAmount, description, category, UserId: req.user.id }], { session })
        await User.updateOne(
            { _id: req.user._id },
            { totalExpenses: expenseAmount + req.user.totalExpenses },
            { session}
        );
        await session.commitTransaction()
        session.endSession()
        res.status(200).json({ message: "Expense added sucessfully." })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.status(500).json({ error: "Internal Server error." })
    }
}

exports.deleteExpense = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const id = req.params.id
        const expense = await Expense.findById({_id:id})
        await Expense.deleteOne({ _id: id}, { session })
        await User.updateOne(
            { _id: req.user._id },
            { totalExpenses: req.user.totalExpenses - expense.expenseAmount },
            {session}
        );
        await session.commitTransaction()
        session.endSession()
        res.status(200).json({ message: "Expense Deleted sucessfully" })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.status(500).json({ error: 'Internal server Error.' })
    }
}

exports.updateExpense = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const id = req.params.id
        const updatedExpense = req.body

        const expense = await Expense.findById({_id:id})
        if (!expense) {
            res.status(404).json({ error: "Expense Not Found" })
        }
        if (expense.UserId !== req.user._id) {
            return res.status(403).json({ error: "Permission Denied." })
        }
        await User.updateOne(
            { _id: req.user._id },
            { totalExpenses: updatedExpense.expenseAmount + req.user.totalExpenses - expense.expenseAmount },
            {session}
        );
        await expense.updateOne({_id:id},{ ...updatedExpense, UserId: req.user.id }, { session })
        await session.commitTransaction()
        session.endSession()
        res.status(200).json({ message: "Expense Updated Sucessfully" })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.status(500).json({ error: "Internal Server Error." })
    }
}



exports.downloadExpense = async (req, res) => {
    try {
        const expenses = await Expense.find({UserId: req.user._id}).sort({createdAt:'desc'})
        const stringyfiedExpense = JSON.stringify(expenses)
        const filename = `expenses-${req.user.id}-${new Date()}.txt`
        const fileUrl = await uploadToS3(stringyfiedExpense, filename)
        await FileDonload.create({ url: fileUrl, UserId: req.user._id })
        const donloads = await FileDonload.find({UserId: req.user._id})
        res.status(200).json({ url: fileUrl, donloads })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error." })
    }
}




