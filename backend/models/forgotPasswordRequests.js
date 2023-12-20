const mongoose = require('mongoose')

const ForgotPasswordRequestSchema = new mongoose.Schema({
    isactive: {
        type: Boolean,
        required: true,
        default: true
    },
    uniqueId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })


module.exports = mongoose.model("ForgotPasswordRequest", ForgotPasswordRequestSchema)
