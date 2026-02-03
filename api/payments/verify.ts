import { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { randomUUID } from "crypto";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

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

    // Generate a temporary booking ID for testing
    const tempBookingId = randomUUID();

    console.log("=== Payment Verified ===");
    console.log("Order ID:", razorpayOrderId);
    console.log("Payment ID:", razorpayPaymentId);
    console.log("Booking ID:", tempBookingId);

    res.status(200).json({
      message: "Payment verified successfully",
      bookingId: tempBookingId,
      razorpayOrderId,
      razorpayPaymentId,
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: `Payment verification failed: ${errorMessage}` });
  }
}
