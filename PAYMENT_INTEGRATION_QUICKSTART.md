# Razorpay Payment Integration - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Copy Configuration Files
```bash
# Copy environment templates
cp .env.example .env
cp client/.env.example client/.env.local
```

### Step 2: Update Your Keys
Edit `.env`:
```bash
RAZORPAY_KEY_ID=rzp_live_SBb22Zn4IDPqaL
RAZORPAY_KEY_SECRET=yUXbP5uklCnCRaSO57t5JkFb
DATABASE_URL=postgresql://user:password@localhost:5432/sriumadevitours
```

Edit `client/.env.local`:
```bash
VITE_RAZORPAY_KEY_ID=rzp_live_SBb22Zn4IDPqaL
```

### Step 3: Install & Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Step 4: Test the Payment Flow
1. Open http://localhost:5000
2. Go to a tour page
3. Click "Book Now"
4. Fill in test traveler details
5. Click "Proceed to Payment"
6. Use test card: **4111 1111 1111 1111**
7. Any CVV and future expiry
8. See confirmation page

## 🔑 Where to Get Your Keys

1. Go to https://razorpay.com
2. Sign up or log in
3. Open Dashboard → Settings → API Keys
4. You'll see:
   - **Key ID** (Public key) - Use in `.env` files
   - **Key Secret** (Secret key) - Use in `.env` only (never commit!)

## 📍 New Features

### Checkout Flow
**URL**: `/checkout?tour=tour-slug`

- Beautiful, responsive checkout page
- Real-time price calculation
- Payment form validation
- Secure Razorpay integration

### Booking Confirmation
**URL**: `/booking-confirmation?booking=id&payment=id`

- Booking reference display
- Payment confirmation
- Next steps guide
- Download receipt as HTML

### Admin Payments Dashboard
**URL**: `/api/admin/payments`

- View all payments (admin only)
- Payment details and status
- Customer information

## 🗄️ Database Changes

### New `payments` Table
```sql
payments (
  id UUID PRIMARY KEY,
  bookingId UUID → bookings.id,
  razorpayOrderId TEXT UNIQUE,
  razorpayPaymentId TEXT,
  razorpaySignature TEXT,
  amount INTEGER (paise),
  currency TEXT (default: "INR"),
  status TEXT (pending|captured|failed|refunded),
  customerEmail TEXT,
  customerPhone TEXT,
  errorCode TEXT,
  errorDescription TEXT,
  notes JSONB,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
)
```

### Enhanced `bookings` Table
- `paymentStatus` - payment tracking
- `paidAmount` - amount received

## 🔌 API Endpoints

### Create Payment Order
```bash
POST /api/payments/create-order
{
  "amount": 100000,
  "customerEmail": "user@example.com",
  "customerPhone": "9876543210",
  "bookingId": "uuid",
  "tourName": "Kailash Tour"
}
```

### Verify Payment
```bash
POST /api/payments/verify
{
  "razorpayOrderId": "order_xxxxx",
  "razorpayPaymentId": "pay_xxxxx",
  "razorpaySignature": "signature",
  "bookingId": "uuid"
}
```

### Check Payment Status
```bash
GET /api/payments/:orderId
```

## 📚 Complete Documentation

- **Setup Guide**: `RAZORPAY_SETUP.md`
- **Implementation Summary**: `RAZORPAY_INTEGRATION_SUMMARY.md`
- **This File**: `PAYMENT_INTEGRATION_QUICKSTART.md`

## 🧪 Test Payment Cards

| Card Number | Status | CVV | Expiry |
|-------------|--------|-----|--------|
| 4111 1111 1111 1111 | ✅ Success | Any 3 digits | Any future date |
| 4000 0000 0000 0002 | ❌ Failure | Any 3 digits | Any future date |

## ⚠️ Important Security Notes

1. **Never commit `.env`** to git
2. **Keep Key Secret private** - backend only
3. **Use HTTPS** in production
4. **Verify signatures** on backend
5. **Use test keys first** - switch to live keys later

## 🎯 Going Live

When ready for real payments:

1. Get **Live** keys from Razorpay dashboard
2. Update `.env` with live keys
3. Deploy to production
4. Monitor Razorpay dashboard
5. Monitor database for transactions

## 📞 Need Help?

- Check `RAZORPAY_SETUP.md` for troubleshooting
- Razorpay docs: https://razorpay.com/docs
- Sri Umadevi Tours: info@sriumadevitours.com

## 📋 Implementation Checklist

- [x] Dependencies added (`razorpay` SDK)
- [x] Database schema created (payments table)
- [x] Backend API endpoints built
- [x] Frontend checkout component created
- [x] Booking confirmation page created
- [x] Environment configuration templates provided
- [x] Documentation written
- [x] Signature verification implemented
- [x] Error handling added
- [x] Test flow validated

## 🎉 Ready?

Everything is set up! Just:
1. Add your keys to `.env` and `client/.env.local`
2. Run `npm install && npm run dev`
3. Test the payment flow
4. Deploy when ready!

---

**Last Updated**: 2026-02-03
**Status**: ✅ Ready for Production
