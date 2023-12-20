const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    paymentid: {
        type: String,
    },
    orderid: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })


module.exports = mongoose.model('Order', OrderSchema)
