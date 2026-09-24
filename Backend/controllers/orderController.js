import crypto from "crypto";
import Razorpay from "razorpay";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Recipe from "../models/Recipe.js";

const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    throw new Error("Razorpay test keys are not configured");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

const getErrorMessage = (error, fallback) =>
  error?.error?.description || error?.error?.reason || error?.description || error?.message || fallback;

const getOrderData = async (body, userId) => {
  const { items, deliveryAddress, notes, paymentMethod } = body;
  if (!Array.isArray(items) || items.length === 0 || !deliveryAddress || !paymentMethod) {
    throw new Error("Order items, delivery details, and payment method are required");
  }

  const recipeIds = items
    .map((item) => item.recipeId)
    .filter((id) => mongoose.Types.ObjectId.isValid(id));
  const recipes = await Recipe.find({ _id: { $in: recipeIds }, isAvailable: true });
  const recipeMap = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const orderItems = items.map((item) => {
    const hasRecipeId = mongoose.Types.ObjectId.isValid(item.recipeId);
    const recipe = hasRecipeId ? recipeMap.get(String(item.recipeId)) : null;
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Each item must have a valid quantity");
    }
    if (hasRecipeId && !recipe) {
      throw new Error("One or more selected recipes are unavailable");
    }
    if (!recipe && (!item.name || !Number.isFinite(Number(item.price)) || Number(item.price) < 0)) {
      throw new Error("One or more selected products are invalid");
    }
    return recipe
      ? { recipeId: recipe.id, name: recipe.name, price: recipe.price, quantity, image: recipe.image }
      : { name: item.name, price: Number(item.price), quantity, image: item.image };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 50;
  const deliveryFee = subtotal > 0 ? (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 40) : 0;
  const preparationMinutes = items.reduce((maxMinutes, item) => {
    const recipe = mongoose.Types.ObjectId.isValid(item.recipeId)
      ? recipeMap.get(String(item.recipeId))
      : null;
    const minutes = Number.parseInt(recipe?.preparationTime, 10);
    return Number.isFinite(minutes) ? Math.max(maxMinutes, minutes) : maxMinutes;
  }, 0) || 30;
  return {
    user: userId,
    items: orderItems,
    deliveryAddress,
    notes,
    subtotal,
    deliveryFee,
    totalAmount: subtotal + deliveryFee,
    preparationMinutes,
    paymentMethod,
  };
};

export const createPaymentOrder = async (req, res) => {
  try {
    const orderData = await getOrderData(req.body, req.userExist.id);
    if (orderData.paymentMethod === "cod") {
      const order = await Order.create(orderData);
      return res.status(201).json({ success: true, order });
    }

    const razorpay = getRazorpay();

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(orderData.totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { userId: String(req.userExist.id) },
    });

    return res.status(200).json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderData,
    });
  } catch (err) {
    const message = getErrorMessage(err, "Unable to create the payment order");
    console.error("Unable to create payment order:", message);
    return res.status(400).json({ success: false, message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderData) {
      return res.status(400).json({ success: false, message: "Payment details are incomplete" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    const verifiedOrderData = await getOrderData(orderData, req.userExist.id);
    const order = await Order.create({
      ...verifiedOrderData,
      paymentStatus: "paid",
      orderStatus: "confirmed",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    return res.status(201).json({ success: true, order });
  } catch (err) {
    const message = getErrorMessage(err, "Unable to verify the payment");
    console.error("Unable to verify payment:", message);
    return res.status(400).json({ success: false, message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, user: req.userExist.id });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.orderStatus === "cancelled") {
      return res.status(200).json({ success: true, message: "Order already cancelled", order });
    }

    if (["out_for_delivery", "delivered"].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: "This order cannot be cancelled now" });
    }

    order.orderStatus = "cancelled";
    await order.save();

    return res.status(200).json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Unable to cancel order:", error);
    return res.status(500).json({ success: false, message: "Unable to cancel order" });
  }
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.userExist.id }).sort({ createdAt: -1 });
  return res.status(200).json({ success: true, data: orders });
};
