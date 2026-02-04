# Razorpay Payment Integration - Setup Guide

## Overview
Successfully integrated Razorpay payment gateway into the Darzia Fabrics e-commerce website. Customers can now make secure online payments during checkout.

## What Was Implemented

### 1. Environment Variables Setup
Added Razorpay credentials to `.env.local`:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

**⚠️ IMPORTANT: Replace the placeholder values with your actual Razorpay keys!**

### 2. Database Updates
Updated the `orders` table to store payment information:
- Added `payment_id` column (stores Razorpay payment ID)
- Added `razorpay_order_id` column (stores Razorpay order ID)
- Created indexes for faster lookups

Migration script: `scripts/update-orders-for-razorpay.js`

### 3. API Routes

#### `/api/razorpay` (POST, PUT)
**POST** - Create Razorpay Order:
- Accepts: amount, currency, receipt, notes
- Returns: order_id, amount, currency, key_id
- Creates a Razorpay order for payment processing

**PUT** - Verify Payment:
- Accepts: razorpay_order_id, razorpay_payment_id, razorpay_signature
- Returns: success status
- Verifies payment signature using HMAC SHA256

#### Updated `/api/orders` (POST)
Now accepts additional payment fields:
- `payment_id` - Razorpay payment ID
- `razorpay_order_id` - Razorpay order ID
- `payment_status` - Payment status (Paid/Pending)

### 4. Checkout Flow
Updated `app/checkout/page.tsx` with complete Razorpay integration:

**Step-by-Step Flow:**
1. User fills checkout form
2. Clicks "Proceed to Payment"
3. System creates Razorpay order via API
4. Razorpay checkout modal opens
5. User completes payment
6. Payment is verified server-side
7. Order is created in database with payment details
8. User is redirected to success page

### 5. Dependencies Installed
- `razorpay` - Official Razorpay Node.js SDK

## How to Complete Setup

### Step 1: Get Razorpay Credentials
1. Log in to your Razorpay Dashboard: https://dashboard.razorpay.com/
2. Go to Settings → API Keys
3. Generate API keys (or use existing ones)
4. Copy:
   - **Key ID** (starts with `rzp_test_` or `rzp_live_`)
   - **Key Secret**

### Step 2: Update Environment Variables
Open `.env.local` and replace the placeholder values:

```env
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_KEY_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
```

**Note:** 
- Use `rzp_test_` keys for testing
- Use `rzp_live_` keys for production
- Never commit the `.env.local` file to version control

### Step 3: Restart Development Server
After updating environment variables, restart the dev server:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Step 4: Test the Integration

#### Test Mode (Recommended First):
1. Go to checkout page
2. Fill in customer details
3. Click "Proceed to Payment"
4. Use Razorpay test cards:
   - **Card Number:** 4111 1111 1111 1111
   - **CVV:** Any 3 digits
   - **Expiry:** Any future date
   - **Name:** Any name

#### Test UPI:
- **UPI ID:** success@razorpay
- This will simulate a successful payment

#### Test Failure:
- **Card Number:** 4000 0000 0000 0002
- This will simulate a failed payment

### Step 5: Go Live
When ready for production:
1. Switch to live API keys in `.env.local`
2. Activate your Razorpay account (complete KYC)
3. Configure webhook URLs in Razorpay dashboard (optional)
4. Test with small real transactions first

## Payment Flow Details

### 1. Order Creation
```javascript
POST /api/razorpay
{
  "amount": 5000,  // Amount in INR
  "currency": "INR",
  "receipt": "receipt_123",
  "notes": { "customer_name": "John Doe" }
}
```

### 2. Payment Processing
- Razorpay checkout modal opens
- Customer enters payment details
- Payment is processed by Razorpay
- Success/failure callback is triggered

### 3. Payment Verification
```javascript
PUT /api/razorpay
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```

### 4. Order Storage
```javascript
POST /api/orders
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  // ... other fields
  "payment_id": "pay_xxx",
  "razorpay_order_id": "order_xxx",
  "payment_status": "Paid"
}
```

## Security Features

1. **Server-Side Verification**: Payment signatures are verified server-side using HMAC SHA256
2. **Environment Variables**: Sensitive keys are stored in environment variables
3. **HTTPS Required**: Razorpay requires HTTPS in production
4. **Signature Validation**: Every payment is validated before order creation

## Admin Panel Integration

Orders in the admin panel now show:
- Payment ID
- Razorpay Order ID
- Payment Status (Paid/Pending)

Access admin panel at: `/admin`

## Troubleshooting

### Issue: "Failed to load payment gateway"
**Solution:** Check if Razorpay script is blocked by ad blockers or firewall

### Issue: "Payment verification failed"
**Solution:** 
- Verify RAZORPAY_KEY_SECRET is correct in .env.local
- Check server logs for detailed error messages

### Issue: Order created but payment shows pending
**Solution:**
- Check if payment was actually completed in Razorpay dashboard
- Verify webhook configuration (if using webhooks)

### Issue: "Invalid key_id"
**Solution:**
- Ensure NEXT_PUBLIC_RAZORPAY_KEY_ID matches RAZORPAY_KEY_ID
- Restart dev server after changing environment variables

## Testing Checklist

- [ ] Environment variables are set correctly
- [ ] Dev server restarted after env changes
- [ ] Test payment with test card succeeds
- [ ] Order is created in database with payment details
- [ ] Success page displays correct order information
- [ ] Failed payment shows error message
- [ ] Payment cancellation is handled gracefully
- [ ] Admin panel shows payment information

## Production Checklist

- [ ] Switch to live Razorpay keys
- [ ] Complete Razorpay KYC verification
- [ ] Test with small real transactions
- [ ] Set up payment failure notifications
- [ ] Configure webhook for payment status updates (optional)
- [ ] Set up refund policy
- [ ] Test on mobile devices
- [ ] Verify HTTPS is enabled

## Support Resources

- **Razorpay Documentation:** https://razorpay.com/docs/
- **Test Cards:** https://razorpay.com/docs/payments/payments/test-card-details/
- **API Reference:** https://razorpay.com/docs/api/
- **Support:** https://razorpay.com/support/

## Files Modified/Created

### Created:
1. `app/api/razorpay/route.ts` - Payment order creation and verification
2. `scripts/update-orders-for-razorpay.js` - Database migration script

### Modified:
1. `app/checkout/page.tsx` - Integrated Razorpay checkout flow
2. `app/api/orders/route.ts` - Added payment fields
3. `.env.local` - Added Razorpay credentials
4. `package.json` - Added razorpay dependency

## Next Steps

1. **Replace placeholder Razorpay keys** in `.env.local` with your actual keys
2. **Restart the development server**
3. **Test the payment flow** with test credentials
4. **Go live** when ready!

---

**Need Help?** Contact Razorpay support or check their comprehensive documentation.
