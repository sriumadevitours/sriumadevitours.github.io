import { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "./_lib/storage";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;

      if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "Booking ID is required" });
      }

      const booking = await storage.getBookingById(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.status(200).json(booking);
    } catch (error) {
      console.error("Failed to fetch booking:", error);
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  } else if (req.method === "POST") {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: error.errors });
      }
      console.error("Failed to create booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
