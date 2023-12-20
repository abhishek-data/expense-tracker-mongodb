const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fullname: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            ispremiumuser: {
                type: Boolean,
            },
            totalExpenses: {
                type: Number,
                default:0
            }
}, {timestamps: true})

module.exports = mongoose.model("User", UserSchema)

