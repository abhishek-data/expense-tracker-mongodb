const User = require('../models/user')
const ForgotPasswordRequest = require('../models/forgotPasswordRequests')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const secretKey = process.env.JWT_SECRET

exports.signup = async (req, res, next) => {
    try {
        const { fullname, email, password } = req.body
        const emailMatch = await User.findOne({ email: email })
        if (emailMatch) {
            return res.status(409).json({ message: 'A account is already exits with this email.' })
        }
        bcrypt.hash(password, 10, async (err, hash) => {
            await User.create({ fullname, email, password: hash })
            res.status(201).json({ message: 'You have sucessfully signed-up' })

        })

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

exports.generateAcessToken = (id, email, ispremiumUser) => {
    return jwt.sign({ userId: id, email: email, ispremiumUser: ispremiumUser }, secretKey, { expiresIn: '1h' });
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        const token = jwt.sign({ userId: user.id, email: user.email, ispremiumUser: user.ispremiumuser }, secretKey, { expiresIn: '1h' });

        res.status(200).json({ message: 'You have sucessfully logged-in', token })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

exports.forgotPassword = async (req, res, next) => {
    const userEmail = req.body.email;
    const user = await User.findOne({ email: userEmail });
    if (!user) {
        return res.status(409).json({ message: 'please enter a valid email linked to your account.' })
    }
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sonusingh.web.dev@gmail.com',
            pass: 'qvfqpfrdauqwagqy'
        }
    });

    const resetpasswordId = uuidv4();
    ForgotPasswordRequest.create({ uniqueId: resetpasswordId, isactive: true, userId: user.id })
    const resetLink = `http://localhost:5173/password/resetpassword/${resetpasswordId}`;
    const mailOptions = {
        from: 'sonusingh.web.dev@gmail.com',
        to: userEmail,
        subject: 'Password Reset',
        html: `
      <p>Hello,</p>
      <p>You have requested to reset your password.</p>
      <p>Click the following link to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you didn't request this, please ignore this email.</p>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent successfully.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.resetPassword = async (req, res, next) => {
    const resetpasswordId = req.params.id;
    const { password } = req.body;
    const resetRequest = await ForgotPasswordRequest.findOne({ uniqueId: resetpasswordId })
    if (!resetRequest) {
        return res.status(409).json({ message: 'Invalid reset password link.' })
    }
    if (!resetRequest.isactive) {
        return res.status(409).json({ message: 'This reset password link has been expired.' })
    }
    const user = await User.findOne({ _id: resetRequest.userId })
    if (!user) {
        return res.status(409).json({ message: 'Invalid reset password link.' })
    }
    bcrypt.hash(password, 10, async (err, hash) => {
        user.password = hash
        await user.save()
        resetRequest.isactive = false
        await resetRequest.save()
        res.status(200).json({ message: 'Password reset successfully.' })
    })
}






