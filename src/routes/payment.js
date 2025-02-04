const express = require("express");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const { userAuth } = require("../middlewares/auth");
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils')

const Payment = require("../model/payment");
const User = require("../model/user");
const { membershipAmount } = require("../utils/constants");
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  const { membershipType } = req.body;
  const { firstName, lastName, emailId } = req.user
  try {
    const order = await razorpayInstance.orders.create({
      "amount": membershipAmount[membershipType],
      "currency": "INR",
      "receipt": "receipt#1",
      "notes": {
        firstName,
        lastName,
        emailId,
        membershipType
      }
    });
    //Save it in my database

    //return back order details to frontend
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      receipt: order.receipt,
      notes: order.notes,
      currency: order.currency
    });
    const savePayment = await payment.save();
    res.json({ ...savePayment.toJSON(), keyId: process.env.RAZORPAY_SECRET_KEY });

  } catch (error) {
    console.log("Error", error);

    return res.status(500).json({ message: error.message })
  }
});
//This is called by razorpay so don't use userAuth
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get["X-Razorpay-Signature"]
    //razor pay sends req.body and also X-Razorpay-Signature in header -=> which is webHookSignature
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body), 
      webhookSignature, 
      RAZORPAY_WEBHOOK_SECRET
    );
    if(!isWebhookValid){
      return res.status(400).json({message:"Webhook signature is invalid"})
    }
    console.log("reqBody", req.body);
          //Update my payment status in DB
        //Update the user as premium
        //If we don't use razorpay the webhook will keep calling
        //return success response to razorpay
        const paymentDetails = req.body.payload.payment.entity;
        
      if(req.body.event == "payment.captured"){
        const payment = await Payment.findOne({orderId: paymentDetails.order_id});
        payment.status = paymentDetails.status();
        await payment.save();
        const user = await User({_id:payment.userId});
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();
      }
      if(req.body.event == "payment.failed"){

      }
      return res.status(200).json({message:"Webhook seceded successfully"})
    // #webhook_body should be raw webhook request body
  } catch (error) {
    console.log("Error", error);

    return res.status(500).json({ message: error.message })
  }
});
module.exports = paymentRouter;
