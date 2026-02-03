import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Tour {
  id: string;
  name: string;
  pricePerPerson: number;
  duration: string;
}

interface Departure {
  id: string;
  departureDate: string;
  returnDate: string;
  availableSeats: number;
}

const bookingSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  numberOfTravelers: z
    .number()
    .min(1, "At least 1 traveler")
    .max(20, "Maximum 20 travelers"),
  departureId: z.string().optional().default(""),
  paymentType: z.enum(["full", "deposit"], {
    errorMap: () => ({ message: "Select payment type" }),
  }),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingCheckoutProps {
  tour: Tour;
  departures: Departure[];
  onSuccess?: (bookingId: string) => void;
}

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export function BookingCheckout({
  tour,
  departures,
  onSuccess,
}: BookingCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      numberOfTravelers: 1,
      departureId: "",
      paymentType: "deposit",
      specialRequests: "",
    },
  });

  const numberOfTravelers = form.watch("numberOfTravelers");
  const paymentType = form.watch("paymentType");
  const departureId = form.watch("departureId");
  const selectedDeparture = departureId ? departures.find((d) => d.id === departureId) : null;

  const totalAmount = tour.pricePerPerson * numberOfTravelers;

  // Fixed deposit for Chardham Yatra (≥21), percentage for others
  let depositAmount = 0;
  if (tour.slug === "chardham-yatra") {
    depositAmount = 25; // Fixed ₹25 deposit for Chardham Yatra
  } else {
    depositAmount = Math.ceil(totalAmount * 0.1); // 10% for other tours
  }

  const paymentAmount = paymentType === "deposit" ? depositAmount : totalAmount;

  async function onSubmit(data: BookingFormData) {
    // For full payment, departure date is required
    if (paymentType === "full" && !selectedDeparture) {
      setErrorMessage("Please select a departure date for full payment");
      return;
    }

    setIsLoading(true);
    setPaymentStatus("processing");
    setErrorMessage("");

    try {
      // Create order via API
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: paymentAmount,
          currency: "INR",
          customerId: `${data.customerEmail}-${Date.now()}`,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          customerName: data.customerName,
          tourId: tour.id,
          departureId: selectedDeparture?.id || null,
          numberOfTravelers: paymentType === "full" ? data.numberOfTravelers : 1,
          totalAmount: totalAmount,
          paymentType: data.paymentType,
          specialRequests: data.specialRequests || "",
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create payment order");
      }

      const order = await orderResponse.json();

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        const razorpay = new window.Razorpay({
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          order_id: order.id,
          handler: async function (response: any) {
            try {
              const verifyResponse = await fetch(
                "/api/payments/verify",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                    customerEmail: data.customerEmail,
                    tourId: tour.id,
                    departureId: selectedDeparture?.id || null,
                    numberOfTravelers: paymentType === "full" ? data.numberOfTravelers : 1,
                    totalAmount: totalAmount,
                    paidAmount: paymentAmount,
                    paymentType: data.paymentType,
                    customerName: data.customerName,
                    customerPhone: data.customerPhone,
                    specialRequests: data.specialRequests || "",
                  }),
                }
              );

              if (!verifyResponse.ok) {
                throw new Error("Payment verification failed");
              }

              const verifyData = await verifyResponse.json();
              setPaymentStatus("success");

              // Redirect to success page after 2 seconds
              setTimeout(() => {
                window.location.href = `/booking-confirmation?bookingId=${verifyData.bookingId}&paymentType=${data.paymentType}`;
              }, 2000);
            } catch (error) {
              console.error("Verification error:", error);
              setPaymentStatus("error");
              setErrorMessage("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: data.customerName,
            email: data.customerEmail,
            contact: data.customerPhone,
          },
          theme: {
            color: "#3b82f6",
          },
        });

        razorpay.open();
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error("Booking error:", error);
      setPaymentStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create booking"
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (paymentStatus === "success") {
    return (
      <Card className="p-6 border-green-200 bg-green-50">
        <div className="flex items-center gap-3 text-green-700">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <p className="font-semibold">Payment Successful!</p>
            <p className="text-sm">Redirecting to confirmation page...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-2xl font-bold mb-6">Book {tour.name}</h3>

        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Personal Information</h4>

              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="9876543210"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>10-digit mobile number</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Trip Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Trip Details</h4>

              {paymentType === "full" && (
                <FormField
                  control={form.control}
                  name="numberOfTravelers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Travelers *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {paymentType === "full" && (
                <FormField
                  control={form.control}
                  name="departureId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Date *</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select a departure date</option>
                          {departures.map((dep) => (
                            <option key={dep.id} value={dep.id}>
                              {new Date(dep.departureDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}{" "}
                              ({dep.availableSeats} seats available)
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requests (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any dietary restrictions, accessibility needs, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Payment Type Selection */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Payment Type</h4>
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="deposit" id="deposit" />
                          <Label
                            htmlFor="deposit"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-semibold">
                              Pay Deposit (10%)
                            </div>
                            <div className="text-sm text-gray-600">
                              Pay ₹{depositAmount.toLocaleString("en-IN")} now to
                              confirm booking. Pay remaining on the trip.
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="full" id="full" />
                          <Label
                            htmlFor="full"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-semibold">Pay Full Amount</div>
                            <div className="text-sm text-gray-600">
                              Pay entire amount (₹{totalAmount.toLocaleString("en-IN")}) now.
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Price Summary */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price per person:</span>
                  <span className="font-semibold">
                    ₹{tour.pricePerPerson.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Number of travelers:</span>
                  <span className="font-semibold">{numberOfTravelers}</span>
                </div>
                <div className="border-t border-blue-200 pt-3 flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-lg">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                {paymentType === "deposit" && (
                  <div className="bg-white rounded p-2 flex justify-between">
                    <span className="text-gray-600 text-sm">
                      You pay now (10%):
                    </span>
                    <span className="font-bold text-lg text-blue-600">
                      ₹{depositAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || paymentStatus === "processing"}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {isLoading || paymentStatus === "processing" ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${paymentAmount.toLocaleString("en-IN")}`
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By clicking pay, you agree to our terms and conditions.
              Your payment is secure and encrypted.
            </p>
          </form>
        </Form>
      </Card>
    </div>
  );
}
