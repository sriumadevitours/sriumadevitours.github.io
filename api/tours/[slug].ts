import { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "@server/storage";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { slug } = req.query;

    if (!slug || typeof slug !== "string") {
      return res.status(400).json({ message: "Tour slug is required" });
    }

    const tour = await storage.getTourBySlug(slug);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res.status(200).json(tour);
  } catch (error) {
    console.error("Failed to fetch tour:", error);
    res.status(500).json({ message: "Failed to fetch tour" });
  }
}
