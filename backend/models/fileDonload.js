const mongoose = require('mongoose')

const FileDonloadSchema = new mongoose.Schema({
    url: {
        type: String,
        required:true
    },
    UserId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamp: true })


module.exports = mongoose.model("FileDonload", FileDonloadSchema)

