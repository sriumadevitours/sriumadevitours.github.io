import { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../server/storage";
import { insertInquirySchema } from "@shared/schema";
import { z } from "zod";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const validatedData = insertInquirySchema.parse(req.body);
    const inquiry = await storage.createInquiry(validatedData);
    res.status(201).json(inquiry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    }
    console.error("Failed to create inquiry:", error);
    res.status(500).json({ message: "Failed to create inquiry" });
  }
}
