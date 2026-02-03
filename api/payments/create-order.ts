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

    console.log("=== Payment Request ===");
    console.log("Amount:", amount);
    console.log("Customer:", customerName, customerEmail, customerPhone);
    console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID ? "Set" : "NOT SET");
    console.log("Razorpay Secret:", process.env.RAZORPAY_KEY_SECRET ? "Set" : "NOT SET");
    console.log("Database URL:", process.env.DATABASE_URL ? "Set" : "NOT SET");

    if (!amount || !customerEmail || !customerPhone) {
      return res
        .status(400)
        .json({ message: "Missing required fields: amount, customerEmail, customerPhone" });
    }

    // Amount should be in paise (multiply by 100)
    const amountInPaise = Math.round(amount * 100);

    // Step 1: Create Razorpay order
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

    // Step 2: Save payment record to database
    console.log("Saving payment to database...");
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
    console.log("Payment saved with ID:", payment.id);

    console.log("=== Payment Success ===");
    res.status(200).json({
      id: order.id,
      amount: amountInPaise,
      currency: "INR",
      paymentId: payment.id,
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
