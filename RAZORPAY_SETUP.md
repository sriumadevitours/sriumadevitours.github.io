# Razorpay Payment Integration Setup Guide

## Overview

Sri Umadevi Tours website now includes integrated Razorpay payment processing for online tour bookings. This guide will walk you through setting up and configuring the payment gateway.

## Prerequisites

- Node.js 18+ and npm/yarn installed
- Active Razorpay account (https://razorpay.com)
- PostgreSQL database running
- The website running locally or deployed

## Step 1: Get Your Razorpay API Keys

1. Log in to your Razorpay dashboard: https://dashboard.razorpay.com
2. Navigate to **Settings → API Keys**
3. You'll see two keys:
   - **Key ID** (Public key) - Safe to use in frontend
   - **Key Secret** (Secret key) - **KEEP THIS SECRET** - Backend only

⚠️ **SECURITY WARNING**: Never commit your Key Secret to version control. Always use environment variables.

## Step 2: Configure Environment Variables

### Backend (.env file in root directory)

Create a `.env` file in the project root with:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sriumadevitours

# Razorpay Keys
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=yyyyyyyyyyyyyyyyyy

# Other configurations
NODE_ENV=production
PORT=5000
```

### Frontend (.env.local in client directory)

Create a `.env.local` file in the `client` directory:

```bash
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```

**Note**: The Key Secret should NEVER be in frontend .env files.

## Step 3: Database Setup

The payment tables are already defined in the schema. Run migrations:

```bash
# Install dependencies
npm install

# Run database migrations (if applicable)
# The tables will be created when the app starts for the first time
```

### Database Tables Created

**payments** table includes:
- `id` - Unique payment record ID
- `razorpayOrderId` - Razorpay order ID
- `razorpayPaymentId` - Razorpay payment ID
- `razorpaySignature` - Payment signature for verification
- `amount` - Payment amount in paise (multiply rupees by 100)
- `status` - Payment status (pending, captured, failed, refunded)
- `customerEmail` - Customer email
- `customerPhone` - Customer phone number
- `createdAt` / `updatedAt` - Timestamps

## Step 4: Add Razorpay Script to HTML

The Razorpay payment modal is loaded dynamically in the Checkout component. Make sure your `client/index.html` includes:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

This is already included in the Checkout component, so no additional setup needed.

## Step 5: Testing the Integration

### Test Mode (Recommended First)

1. Switch to Test mode in Razorpay dashboard
2. Use test credentials:
   - Key ID: `rzp_test_xxxxxxxxxxxxx`
   - Key Secret: `yyyyyyyyyyyyyyyyy`

### Test Credit Cards

For testing payments in test mode:

- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Testing Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to a tour page and click "Book Now"

3. Fill in traveler information

4. Click "Proceed to Payment"

5. Use test card details above

6. Check the Razorpay dashboard for transaction records

## Step 6: API Endpoints

### Create Payment Order
```
POST /api/payments/create-order
Content-Type: application/json

{
  "amount": 100000,           // Amount in rupees
  "customerEmail": "user@example.com",
  "customerPhone": "9876543210",
  "bookingId": "booking-uuid",
  "tourName": "Kailash Tour"
}

Response:
{
  "orderId": "order_xxxxxxxxxxxx",
  "amount": 10000000,         // Amount in paise
  "currency": "INR",
  "paymentId": "payment-record-id"
}
```

### Verify Payment
```
POST /api/payments/verify
Content-Type: application/json

{
  "razorpayOrderId": "order_xxxxxxxxxxxx",
  "razorpayPaymentId": "pay_xxxxxxxxxxxx",
  "razorpaySignature": "signature_hash",
  "bookingId": "booking-uuid"
}

Response:
{
  "message": "Payment verified successfully",
  "payment": { /* payment details */ }
}
```

### Get Payment Status
```
GET /api/payments/:orderId

Response:
{
  "id": "payment-record-id",
  "razorpayOrderId": "order_xxxxxxxxxxxx",
  "razorpayPaymentId": "pay_xxxxxxxxxxxx",
  "status": "captured",
  "amount": 10000000,
  "customerEmail": "user@example.com",
  /* ... other fields ... */
}
```

## Step 7: Payment Flow

### User Journey

1. **Tour Selection** → User selects a tour and clicks "Book Now"
2. **Checkout Page** → `/checkout?tour=tour-slug`
3. **Traveler Details** → User fills in booking information
4. **Payment Review** → Summary showing total amount
5. **Razorpay Modal** → Payment processed securely
6. **Verification** → Backend verifies signature
7. **Confirmation** → `/booking-confirmation?booking=id&payment=id`
8. **Receipt** → User can download receipt as HTML

### Database Changes on Payment

When payment is verified:
- **bookings** table: `paymentStatus` set to "completed", `paidAmount` updated
- **payments** table: Payment details stored with status "captured"

## Step 8: Going Live with Production Keys

When ready to accept real payments:

1. Change Razorpay dashboard to **Live mode**
2. Get your **Live** API keys (different from test keys)
3. Update `.env` with live keys:
   ```bash
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=yyyyyyyyyyyyyyyyyy
   ```
4. Deploy to production
5. Monitor transactions in Razorpay dashboard

## Troubleshooting

### Payment Not Loading

**Problem**: Razorpay modal doesn't appear

**Solution**:
- Ensure Razorpay script is loaded: `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>`
- Check browser console for errors
- Verify `VITE_RAZORPAY_KEY_ID` is set in `.env.local`

### Payment Verification Fails

**Problem**: "Invalid payment signature" error

**Solution**:
- Verify `RAZORPAY_KEY_SECRET` is correct
- Check signature is being generated correctly
- Ensure keys match between Razorpay dashboard and `.env`

### Amount Issues

**Problem**: Amount shown incorrectly or payment fails for amount mismatch

**Solution**:
- Remember: Razorpay uses paise (multiply rupees by 100)
- Conversion happens in frontend and backend
- Check `/api/payments/create-order` returns correct amount

### Database Connection

**Problem**: "Failed to create booking/payment"

**Solution**:
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Run `npm run db:push` if migrations not applied

## Security Best Practices

1. **Never commit secrets**: Use environment variables
2. **Use HTTPS**: Payment page must be served over HTTPS in production
3. **Verify signatures**: Always verify payment signature on backend
4. **Sanitize input**: All user input validated with Zod
5. **Rate limiting**: Consider implementing rate limiting on payment endpoints
6. **Audit logs**: Payment transactions logged in database for audit trail

## Support

For issues or questions:

- **Razorpay Support**: https://razorpay.com/support
- **Sri Umadevi Tours**: info@sriumadevitours.com
- **Phone**: +91 95816 08979

## API Reference Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/bookings` | POST | Create booking |
| `/api/bookings/:id` | GET | Get booking details |
| `/api/payments/create-order` | POST | Create Razorpay order |
| `/api/payments/verify` | POST | Verify payment signature |
| `/api/payments/:orderId` | GET | Check payment status |
| `/api/admin/payments` | GET | Admin: View all payments |

## Next Steps

1. Test with test keys in development
2. Create test bookings and payments
3. Monitor logs and database for issues
4. Switch to live keys when ready
5. Enable email notifications for booking confirmations
6. Set up WhatsApp notifications (optional enhancement)

---

**Version**: 1.0
**Last Updated**: 2026-02-03
**Maintained by**: Claude Code
