import { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../../server/storage";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { amount, customerEmail, customerPhone, customerName } = req.body;

    if (!amount || !customerEmail || !customerPhone) {
      return res
        .status(400)
        .json({ message: "Missing required fields: amount, customerEmail, customerPhone" });
    }

    // Amount should be in paise (multiply by 100)
    const amountInPaise = Math.round(amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        customerName,
        customerEmail,
        customerPhone,
      },
    });

    // Save payment record to database
    const payment = await storage.createPayment({
      razorpayOrderId: order.id,
      amount: amountInPaise,
      currency: "INR",
      customerEmail,
      customerPhone,
      status: "pending",
      notes: {
        customerName,
      } as any,
    });

    res.status(200).json({
      id: order.id,
      amount: amountInPaise,
      currency: "INR",
      paymentId: payment.id,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: `Failed to create order: ${errorMessage}` });
  }
}
