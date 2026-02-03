import { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../_lib/storage";
import crypto from "crypto";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } =
      req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res
        .status(400)
        .json({ message: "Missing payment verification details" });
    }

    // Verify signature
    const text = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(text)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Update payment record
    const payment = await storage.getPaymentByRazorpayOrderId(razorpayOrderId);
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    const updatedPayment = await storage.updatePayment(payment.id, {
      razorpayPaymentId,
      razorpaySignature,
      status: "captured",
    });

    // Update booking status if bookingId exists
    if (bookingId) {
      await storage.updateBooking(bookingId, {
        paymentStatus: "completed",
        paidAmount: payment.amount / 100, // Convert back to rupees
      });
    }

    res.status(200).json({
      message: "Payment verified successfully",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
}
