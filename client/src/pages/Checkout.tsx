// Razorpay Payment Checkout - Integrated with Supabase + Vercel
// Payment flow: Create booking → Create Razorpay order → Verify signature → Confirm
import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().regex(/^[0-9]{10}$/, "Valid 10-digit phone number required"),
  numberOfTravelers: z.number().min(1, "At least 1 traveler required"),
  specialRequests: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const tourSlug = searchParams.get("tour");
  const departureId = searchParams.get("departure");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      numberOfTravelers: 1,
    },
  });

  const numberOfTravelers = watch("numberOfTravelers");

  useEffect(() => {
    if (tourSlug) {
      fetchTour();
    }
  }, [tourSlug]);

  const fetchTour = async () => {
    try {
      const response = await fetch(`/api/tours/${tourSlug}`);
      if (!response.ok) throw new Error("Tour not found");
      const data = await response.json();
      setTour(data);
    } catch (err) {
      setError("Failed to load tour details");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = tour ? (tour.pricePerPerson || 0) * (numberOfTravelers || 1) : 0;

  const onSubmit = async (formData: CheckoutFormData) => {
    if (!tour) {
      setError("Tour details not loaded");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Step 1: Create a booking record
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour.id,
          departureId: departureId || null,
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          numberOfTravelers: formData.numberOfTravelers,
          totalAmount: totalAmount,
          specialRequests: formData.specialRequests,
          paymentStatus: "pending",
          bookingStatus: "pending",
        }),
      });

      if (!bookingResponse.ok) throw new Error("Failed to create booking");
      const booking = await bookingResponse.json();

      // Step 2: Create Razorpay order
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          bookingId: booking.id,
          tourName: tour.name,
        }),
      });

      if (!orderResponse.ok) throw new Error("Failed to create payment order");
      const orderData = await orderResponse.json();

      // Step 3: Open Razorpay payment modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Sri Umadevi Tours",
        description: `Booking for ${tour.name}`,
        order_id: orderData.orderId,
        customer_id: booking.id,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#FFD700",
        },
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                bookingId: booking.id,
              }),
            });

            if (verifyResponse.ok) {
              setSuccess(true);
              // Redirect to confirmation page after 2 seconds
              setTimeout(() => {
                window.location.href = `/booking-confirmation?booking=${booking.id}&payment=${orderData.paymentId}`;
              }, 2000);
            } else {
              setError("Payment verification failed");
            }
          } catch (err) {
            setError("Payment verification error. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            setError("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.message || "Checkout failed. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-divine-gold" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-md mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Tour not found. Please select a tour to book.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">{tour.name}</p>
        </div>

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Payment successful! Redirecting to confirmation...
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Traveler Information</CardTitle>
                <CardDescription>Please provide your details for the booking</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        {...register("firstName")}
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        {...register("lastName")}
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="9876543210"
                      {...register("phone")}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="numberOfTravelers">Number of Travelers</Label>
                    <Input
                      id="numberOfTravelers"
                      type="number"
                      min="1"
                      {...register("numberOfTravelers", { valueAsNumber: true })}
                      className={errors.numberOfTravelers ? "border-red-500" : ""}
                    />
                    {errors.numberOfTravelers && (
                      <p className="text-red-500 text-sm mt-1">{errors.numberOfTravelers.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                    <textarea
                      id="specialRequests"
                      placeholder="Any special requirements or preferences..."
                      {...register("specialRequests")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine-gold"
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting || success}
                    className="w-full bg-divine-gold hover:bg-yellow-600 text-black font-semibold"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Proceed to Payment"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{tour.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{tour.duration} days</p>
                </div>

                <hr className="border-gray-200" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per person</span>
                    <span className="font-semibold">₹{tour.pricePerPerson?.toLocaleString("en-IN") || "0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of travelers</span>
                    <span className="font-semibold">{numberOfTravelers}</span>
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Total Amount</span>
                  <span className="text-divine-gold font-bold text-xl">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-xs text-blue-700">
                    ✓ Secure payment via Razorpay
                    <br />✓ Instant booking confirmation
                    <br />✓ 24/7 customer support
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
