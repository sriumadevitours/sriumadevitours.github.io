import { VercelRequest, VercelResponse } from "@vercel/node";
import Razorpay from "razorpay";
import { randomUUID } from "crypto";

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

    console.log("=== Payment Request ===");
    console.log("Amount:", amount);
    console.log("Customer:", customerName, customerEmail, customerPhone);
    console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID ? "Set" : "NOT SET");
    console.log("Razorpay Secret:", process.env.RAZORPAY_KEY_SECRET ? "Set" : "NOT SET");

    if (!amount || !customerEmail || !customerPhone) {
      return res
        .status(400)
        .json({ message: "Missing required fields: amount, customerEmail, customerPhone" });
    }

    // Amount should be in paise (multiply by 100)
    const amountInPaise = Math.round(amount * 100);

    // Create Razorpay order
    console.log("Creating Razorpay order...");
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
    console.log("Razorpay order created:", order.id);

    // Generate a temporary payment ID for testing
    const tempPaymentId = randomUUID();

    console.log("=== Payment Success ===");
    res.status(200).json({
      id: order.id,
      amount: amountInPaise,
      currency: "INR",
      paymentId: tempPaymentId,
    });
  } catch (error) {
    console.error("=== Order Creation Failed ===");
    console.error("Error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: `Failed to create order: ${errorMessage}` });
  }
}
