const express = require("express")
const path = require("path")
const fs = require("fs")
const helmet = require("helmet")
const compression = require('compression')
const morgan = require('morgan')
require("dotenv").config()
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const cors = require("cors")
const authRoutes = require('./routes/auth')
const expenseRoutes = require('./routes/expense')
const purchageRoutes = require('./routes/purchage')



const app = express()

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);
app.use(express.json())
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(authRoutes)
app.use("/expense", expenseRoutes)
app.use("/purchage", purchageRoutes)

const PORT = process.env.PORT || 5000


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected")
        app.listen(PORT)
    })
    .catch(err => console.log(err))


