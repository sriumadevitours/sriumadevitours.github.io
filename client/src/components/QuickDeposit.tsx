import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const depositSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
});

type DepositFormData = z.infer<typeof depositSchema>;

const DEPOSIT_AMOUNT = 25; // Fixed deposit amount ≥ 21

interface QuickDepositProps {
  onSuccess?: (bookingId: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function QuickDeposit({ onSuccess }: QuickDepositProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
    },
  });

  async function onSubmit(data: DepositFormData) {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Create payment order
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: DEPOSIT_AMOUNT * 100, // Razorpay expects amount in paise
          currency: "INR",
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          description: "Deposit - Chardham Yatra",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment order");
      }

      const orderData = await response.json();

      // Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: DEPOSIT_AMOUNT * 100,
        currency: "INR",
        name: "Sriuma Devi Tours",
        description: "Deposit Payment",
        order_id: orderData.id,
        customer_id: orderData.customerId,
        prefill: {
          name: data.customerName,
          email: data.customerEmail,
          contact: data.customerPhone,
        },
        theme: {
          color: "#0ea5e9",
        },
        handler: async function (response: any) {
          setPaymentStatus("processing");
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            const verifyData = await verifyResponse.json();

            setPaymentStatus("success");
            setSuccessMessage(
              `Payment successful! Booking ID: ${verifyData.bookingId}`
            );

            // Redirect after 2 seconds
            setTimeout(() => {
              window.location.href = `/booking-confirmation?bookingId=${verifyData.bookingId}&paymentType=deposit`;
            }, 2000);
          } catch (error) {
            setPaymentStatus("error");
            setErrorMessage(
              error instanceof Error ? error.message : "Payment verification failed"
            );
          }
        },
        modal: {
          ondismiss: function () {
            setPaymentStatus("error");
            setErrorMessage("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setPaymentStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to process payment"
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Pay Deposit</h1>
          <p className="text-gray-600">Quick deposit for Chardham Yatra</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {successMessage && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Deposit Form */}
        <Card className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Deposit Amount */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 mb-1">Deposit Amount</p>
                <p className="text-3xl font-bold text-blue-900">
                  ₹{DEPOSIT_AMOUNT.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Customer Name */}
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        {...field}
                        disabled={isLoading || paymentStatus === "processing"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Customer Email */}
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        disabled={isLoading || paymentStatus === "processing"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Customer Phone */}
              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="10-digit phone number"
                        {...field}
                        disabled={isLoading || paymentStatus === "processing"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                disabled={isLoading || paymentStatus === "processing"}
                size="lg"
              >
                {isLoading || paymentStatus === "processing" ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${DEPOSIT_AMOUNT.toLocaleString("en-IN")}`
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By clicking pay, you agree to our terms and conditions.
                Your payment is secure and encrypted.
              </p>
            </form>
          </Form>
        </Card>

        {/* Info */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 <strong>Deposit Details:</strong> This is a deposit payment for
            Chardham Yatra. Our team will contact you shortly to confirm your
            booking.
          </p>
        </div>
      </div>
    </div>
  );
}
