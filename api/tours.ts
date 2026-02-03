import { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../server/storage";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const tours = await storage.getTours();
    res.status(200).json(tours);
  } catch (error) {
    console.error("Failed to fetch tours:", error);
    res.status(500).json({ message: "Failed to fetch tours" });
  }
}
