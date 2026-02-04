import React, { createContext, useContext, useEffect, useState } from "react";

interface CurrencyContextType {
  currency: "USD" | "INR";
  exchangeRate: number;
  country: string;
  convertInrToUsd: (amountInr: number) => number;
  convertUsdToInr: (amountUsd: number) => number;
  formatPrice: (amount: number, currency?: "USD" | "INR") => string;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<"USD" | "INR">("INR");
  const [exchangeRate, setExchangeRate] = useState(0.012);
  const [country, setCountry] = useState("IN");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await fetch("/api/currency");
        const data = await response.json();
        setCountry(data.country);
        setCurrency(data.currency);
        setExchangeRate(data.exchangeRate);
      } catch (error) {
        console.error("Failed to fetch currency info:", error);
        // Defaults already set
      } finally {
        setLoading(false);
      }
    };

    fetchCurrency();
  }, []);

  const convertInrToUsd = (amountInr: number): number => {
    return Math.round(amountInr * exchangeRate * 100) / 100;
  };

  const convertUsdToInr = (amountUsd: number): number => {
    return Math.round((amountUsd / exchangeRate) * 100) / 100;
  };

  const formatPrice = (amount: number, curr?: "USD" | "INR"): string => {
    const activeCurrency = curr || currency;

    if (activeCurrency === "USD") {
      return `$${amount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    } else {
      return `₹${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        exchangeRate,
        country,
        convertInrToUsd,
        convertUsdToInr,
        formatPrice,
        loading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
