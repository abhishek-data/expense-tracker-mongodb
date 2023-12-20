const User = require('../models/user')
const Expense = require('../models/expense')
const Razorpay = require('razorpay')
const Order = require("../models/orders")
const authController = require("../controllers/authController")



exports.getPremium = async (req, res, next) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret
        });
        const amount = 999;
        const createOrder = () => {
            return new Promise((resolve, reject) => {
                rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(order);
                    }
                });
            });
        };

        const order = await createOrder();
        await Order.create({ orderid: order.id, status: "PENDING", UserId: req.user._id })
        return res.status(201).json({ order, key_id: rzp.key_id });
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: "Something went wrong", error: error.message });
    }
}


exports.updatePayment = async (req, res, next) => {
    try {
        const { order_id, payment_id } = req.body;
        console.log(order_id, payment_id);
        const order = await Order.findOne({ orderid: order_id });

        if (!order) {
            console.error('Order not found');
            return res.status(404).json({ message: 'Order not found' });
        }
        order.paymentid = payment_id;
        order.status = 'SUCCESSFUL';
        await order.save()
        req.user.ispremiumuser = true;
        await req.user.save()

        return res.status(202).json({ success: true, message: 'Transaction successful', token: authController.generateAcessToken(req.user.id, req.user.email, true) });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

exports.getLeaderBoardData = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $project: {
                    id: '&_id',
                    fullname:1,
                    totalExpenses:1
                }
            },
            {
                $sort: {
                    totalExpenses:-1
                }
            }
        ]);
        return res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}
