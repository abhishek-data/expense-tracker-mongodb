const jwt = require('jsonwebtoken');
const User = require('../models/user')

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('authorization')
        const userId = jwt.verify(token, process.env.JWT_SECRET).userId
        const user = await User.findById({_id:userId})
        if (!user) {
            return res.status(404).json({ error: "User Not Found" })
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = { authenticate }