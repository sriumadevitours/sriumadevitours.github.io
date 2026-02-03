import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2, Download, Mail, Phone } from "lucide-react";

export default function BookingConfirmation() {
  const [booking, setBooking] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location] = useLocation();

  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const bookingId = searchParams.get("booking");
  const paymentId = searchParams.get("payment");

  useEffect(() => {
    if (bookingId && paymentId) {
      fetchConfirmationDetails();
    } else {
      setError("Invalid confirmation link");
      setLoading(false);
    }
  }, [bookingId, paymentId]);

  const fetchConfirmationDetails = async () => {
    try {
      const [bookingRes, paymentRes] = await Promise.all([
        fetch(`/api/bookings/${bookingId}`),
        fetch(`/api/payments/${paymentId}`),
      ]);

      if (!bookingRes.ok) throw new Error("Booking not found");
      if (!paymentRes.ok) throw new Error("Payment not found");

      const bookingData = await bookingRes.json();
      const paymentData = await paymentRes.json();

      setBooking(bookingData);
      setPayment(paymentData);
    } catch (err: any) {
      setError(err.message || "Failed to load confirmation details");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!booking || !payment) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Booking Receipt - Sri Umadevi Tours</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; border-bottom: 3px solid #FFD700; padding-bottom: 20px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #1E40AF; }
          .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; color: #1E40AF; border-bottom: 2px solid #FFD700; padding-bottom: 10px; margin-bottom: 10px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .label { font-weight: 500; color: #555; }
          .value { color: #333; }
          .total-section { background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px; }
          .total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #FFD700; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 15px; }
          .status-badge { display: inline-block; background: #10b981; color: white; padding: 5px 10px; border-radius: 3px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🏔️ Sri Umadevi Tours</div>
          <div class="subtitle">Divine Spiritual Journeys</div>
        </div>

        <div class="section">
          <div class="section-title">Booking Confirmation</div>
          <div class="row">
            <span class="label">Booking Reference:</span>
            <span class="value">${booking.id}</span>
          </div>
          <div class="row">
            <span class="label">Status:</span>
            <span class="value"><span class="status-badge">✓ Confirmed</span></span>
          </div>
          <div class="row">
            <span class="label">Booking Date:</span>
            <span class="value">${new Date(booking.createdAt).toLocaleDateString("en-IN")}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Traveler Information</div>
          <div class="row">
            <span class="label">Name:</span>
            <span class="value">${booking.customerName}</span>
          </div>
          <div class="row">
            <span class="label">Email:</span>
            <span class="value">${booking.customerEmail}</span>
          </div>
          <div class="row">
            <span class="label">Phone:</span>
            <span class="value">${booking.customerPhone}</span>
          </div>
          <div class="row">
            <span class="label">Number of Travelers:</span>
            <span class="value">${booking.numberOfTravelers}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Tour Details</div>
          <div class="row">
            <span class="label">Tour Name:</span>
            <span class="value">${booking.tourName || "Tour Booked"}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Payment Information</div>
          <div class="row">
            <span class="label">Payment ID:</span>
            <span class="value">${payment.razorpayPaymentId}</span>
          </div>
          <div class="row">
            <span class="label">Order ID:</span>
            <span class="value">${payment.razorpayOrderId}</span>
          </div>
          <div class="row">
            <span class="label">Payment Status:</span>
            <span class="value" style="color: #10b981; font-weight: bold;">✓ Completed</span>
          </div>
        </div>

        <div class="total-section">
          <div class="row" style="margin-bottom: 15px;">
            <span class="label">Tour Amount:</span>
            <span class="value">₹${(booking.totalAmount || 0).toLocaleString("en-IN")}</span>
          </div>
          <div class="total-row">
            <span>Total Amount Paid:</span>
            <span>₹${(payment.amount / 100).toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div class="footer">
          <p>📞 Contact Us: +91 95816 08979</p>
          <p>📧 Email: info@sriumadevitours.com</p>
          <p>This is an automated booking confirmation. Please keep this receipt for your records.</p>
          <p style="margin-top: 15px; color: #999;">Generated on ${new Date().toLocaleString("en-IN")}</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([receiptHTML], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `booking-receipt-${booking.id}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-divine-gold" />
      </div>
    );
  }

  if (error || !booking || !payment) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-md mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || "Confirmation details not found"}</AlertDescription>
          </Alert>
          <Button className="w-full mt-4" onClick={() => (window.location.href = "/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your tour booking has been successfully completed</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Booking Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-divine-gold">
              <p className="text-sm text-gray-600 mb-1">Reference Number</p>
              <p className="text-2xl font-bold text-gray-900 font-mono">{booking.id}</p>
              <p className="text-xs text-gray-500 mt-2">Keep this number for your records</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Traveler Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-gray-900">{booking.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {booking.customerEmail}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {booking.customerPhone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Number of Travelers</p>
                <p className="font-semibold text-gray-900">{booking.numberOfTravelers}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <p className="font-semibold text-green-600">✓ Completed</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment ID</p>
                <p className="font-mono text-sm text-gray-900">{payment.razorpayPaymentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="font-bold text-xl text-divine-gold">₹{(payment.amount / 100).toLocaleString("en-IN")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>Here's what to expect</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-divine-gold text-black flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <div>
                  <p className="font-semibold text-gray-900">Confirmation Email</p>
                  <p className="text-sm text-gray-600">Check your email for booking confirmation and itinerary details</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-divine-gold text-black flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <div>
                  <p className="font-semibold text-gray-900">Travel Documents</p>
                  <p className="text-sm text-gray-600">We'll send you travel documents and pre-tour information 15 days before departure</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-divine-gold text-black flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <div>
                  <p className="font-semibold text-gray-900">Support Available</p>
                  <p className="text-sm text-gray-600">Our 24/7 customer support is ready to help with any questions</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button onClick={handleDownloadReceipt} variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
          <Button onClick={() => (window.location.href = "/")} className="w-full bg-divine-gold hover:bg-yellow-600 text-black">
            Back to Home
          </Button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-sm text-blue-900">
            <strong>Need help?</strong> Contact us at{" "}
            <a href="mailto:info@sriumadevitours.com" className="font-semibold text-blue-700 hover:underline">
              info@sriumadevitours.com
            </a>{" "}
            or call{" "}
            <a href="tel:+919581608979" className="font-semibold text-blue-700 hover:underline">
              +91 95816 08979
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
