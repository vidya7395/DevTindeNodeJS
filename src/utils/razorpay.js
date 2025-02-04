const Razorpay = require("razorpay")
var instance = new Razorpay({
    key_id: process.env.RAZORPAY_SECRET_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});
module.exports = instance;
