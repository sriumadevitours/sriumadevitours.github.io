import { VercelRequest, VercelResponse } from "@vercel/node";

// Cache exchange rate to avoid excessive API calls
let cachedRate: { rate: number; timestamp: number } | null = null;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

async function getExchangeRate(): Promise<number> {
  const now = Date.now();

  // Return cached rate if still valid
  if (cachedRate && now - cachedRate.timestamp < CACHE_DURATION) {
    return cachedRate.rate;
  }

  try {
    // Fetch INR to USD exchange rate from exchangerate-api.com
    // This is a free tier endpoint that doesn't require authentication
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/INR"
    );
    const data = await response.json();
    const rate = data.rates.USD;

    // Cache the rate
    cachedRate = { rate, timestamp: now };
    return rate;
  } catch (error) {
    console.error("Failed to fetch exchange rate:", error);
    // Fallback to fixed rate if API fails
    return 0.012; // ~1 INR = 0.012 USD (approximate)
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get country from Vercel headers
    const country = (req.headers["x-vercel-ip-country"] as string) || "IN";

    // Get current exchange rate
    const exchangeRate = await getExchangeRate();

    res.status(200).json({
      country,
      currency: country === "US" ? "USD" : "INR",
      exchangeRate, // INR to USD rate
      inrToUsd: exchangeRate,
    });
  } catch (error) {
    console.error("Currency detection error:", error);
    res.status(500).json({
      country: "IN",
      currency: "INR",
      exchangeRate: 0.012,
      inrToUsd: 0.012,
    });
  }
}
