import { useSearch } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Mail, MessageCircle } from "lucide-react";

export default function BookingConfirmation() {
  const query = useSearch();
  const bookingId = new URLSearchParams(query).get("bookingId");
  const paymentType = new URLSearchParams(query).get("paymentType");

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
          <p className="text-gray-600 text-lg">
            Your payment has been received successfully.
          </p>
        </div>

        {/* Booking Details Card */}
        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Booking Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Booking Reference</p>
                <p className="font-mono font-semibold text-sm break-all">
                  {bookingId || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Type</p>
                <p className="font-semibold capitalize">
                  {paymentType === "deposit"
                    ? "Deposit Payment (50%)"
                    : "Full Payment"}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-t pt-6 space-y-3">
            <h3 className="font-semibold">What's Next?</h3>
            <p className="text-sm text-gray-600">
              Confirmation email sent to your registered email address.
            </p>
            {paymentType === "deposit" && (
              <div className="bg-amber-50 p-3 rounded text-sm text-amber-800 border border-amber-200">
                <p className="font-semibold mb-2">50% Deposit Paid</p>
                <p>
                  Pay remaining balance 7 days before your departure date.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Important Information */}
        <Card className="p-6 bg-blue-50 border-blue-200 space-y-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-900">What's Next?</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>
                  ✓ Confirmation email has been sent to your registered email
                </li>
                <li>✓ You'll receive detailed itinerary within 24 hours</li>
                <li>✓ Our team will contact you with additional details</li>
                <li>✓ Save your booking reference for future reference</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 hover:shadow-lg transition-shadow">
            <a
              href="mailto:sriumadevitours@gmail.com"
              className="flex items-center gap-3"
            >
              <Mail className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">Email Us</p>
                <p className="font-semibold text-sm">
                  sriumadevitours@gmail.com
                </p>
              </div>
            </a>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow">
            <a
              href="https://wa.me/919581608979?text=Hi%20I%20have%20a%20booking%20inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <MessageCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">WhatsApp</p>
                <p className="font-semibold text-sm">+91 95816 08979</p>
              </div>
            </a>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => (window.location.href = "/tours")}
          >
            Browse More Tours
          </Button>
          <Button
            className="flex-1"
            onClick={() => (window.location.href = "/")}
          >
            Go to Home
          </Button>
        </div>

        {/* Booking Reference */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-xs text-gray-600">
            Please save your booking reference
          </p>
          <div className="bg-gray-100 p-4 rounded-lg font-mono text-xs break-all">
            {bookingId || "Your booking reference will appear here"}
          </div>
        </div>
      </div>
    </div>
  );
}
