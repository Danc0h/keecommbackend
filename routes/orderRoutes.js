import express from "express";
import expressAsyncHandler from "express-async-handler";
import axios from "axios";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import { isAuth, isAdmin } from "../utils.js";

const orderRouter = express.Router();

orderRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate("user", "name");
    res.send(orders);
  })
);

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: "New Order Created", order });
  })
);

orderRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.put(
  "/:id/deliver",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      res.send({ message: "Order Delivered" });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.send({ message: "Order Paid", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.post(
  "/:id/pay-mpesa",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { amount, phone } = req.body;
    const { id: orderId } = req.params;

    // Convert amount to nearest whole number
    const roundedAmount = Math.round(amount);

    // Convert phone number to international format
    let internationalPhone = phone;
    if (phone.startsWith("0")) {
      internationalPhone = "254" + phone.substring(1);
    }

    try {
      const consumerKey = process.env.MPESA_CONSUMERKEY;
      const consumerSecret = process.env.MPESA_CONSUMERSECRET;
      const shortCode = process.env.MPESA_PAYBILL;
      const passkey = process.env.MPESA_PASSKEY;
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
        "base64"
      );

      // Get access token
      const { data: tokenResponse } = await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      const accessToken = tokenResponse.access_token;

      // Generate timestamp and password
      const timestamp = new Date()
        .toISOString()
        .replace(/[-:T.]/g, "")
        .slice(0, 14);
      const password = Buffer.from(
        `${shortCode}${passkey}${timestamp}`
      ).toString("base64");

      const paymentData = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerBuyGoodsOnline",
        Amount: roundedAmount, // Use the rounded amount here
        PartyA: internationalPhone, // Use the converted phone number
        PartyB: shortCode,
        PhoneNumber: internationalPhone, // Use the converted phone number
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: orderId,
        TransactionDesc: "Payment for order",
      };

      console.log("Payment Request Data:", paymentData);

      const { data: paymentResponse } = await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Payment Response:", paymentResponse);

      res.send(paymentResponse);
    } catch (error) {
      console.error("Payment Error:", error);
      res.status(500).send({ message: error.message });
    }
  })
);

// Mpesa Callback Route

// Mpesa Callback Route
orderRouter.post(
  "/mpesa/callback",
  expressAsyncHandler(async (req, res) => {
    const callbackData = req.body;
    console.log(callbackData);

    /*
    try {
      // Log the full callback data for debugging purposes
      console.log("Full Callback Data:", req.body);

      const callbackData = req.body.Body.stkCallback;

      if (callbackData) {
        const {
          MerchantRequestID,
          CheckoutRequestID,
          ResultCode,
          ResultDesc,
          CallbackMetadata,
        } = callbackData;

        if (CallbackMetadata && CallbackMetadata.Item) {
          const transactionData = CallbackMetadata.Item.reduce((acc, item) => {
            acc[item.Name] = item.Value;
            return acc;
          }, {});

          // Log the extracted transaction data
          console.log("Merchant Request ID:", MerchantRequestID);
          console.log("Checkout Request ID:", CheckoutRequestID);
          console.log("Result Code:", ResultCode);
          console.log("Result Description:", ResultDesc);
          console.log("Transaction Metadata:", transactionData);

          // Example: Update your order status based on ResultCode
          // Note: Implement your own logic here to update order status or handle transactions
          // const order = await Order.findById(transactionData.AccountReference);
          // order.status = ResultCode === 0 ? 'Paid' : 'Failed';
          // await order.save();

          // Respond to M-Pesa that the callback has been processed
          res.status(200).send("Callback received successfully");
        } else {
          res
            .status(400)
            .send("Invalid callback data: Missing CallbackMetadata or Item");
        }
      } else {
        res
          .status(400)
          .send("Invalid callback data: Missing Body or stkCallback");
      }
    } catch (error) {
      console.error("Callback Error:", error);
      res.status(500).send({ message: error.message });
    }
  */
  })
);

export default orderRouter;
