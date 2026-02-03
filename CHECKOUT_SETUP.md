# Checkout System Setup Guide

## Overview
The complete checkout workflow is now implemented with order creation and success confirmation.

## Components Completed

### 1. **Checkout Page** (`app/checkout/page.tsx`)
- Customer details collection form (name, email, phone)
- Billing and shipping address fields
- Order summary sidebar showing items and total
- Form validation for required fields
- Error handling
- Integrates with session for user_id capture
- Auto-clears cart after successful order creation

### 2. **Success Page** (`app/checkout/success/page.tsx`)
- Confirmation message with order ID
- Success email notification message
- Links to continue shopping or return home
- Responsive design matching site aesthetic

### 3. **API Endpoints** (Already Created)
- `POST /api/orders` - Create new order with customer and cart items
- `GET /api/orders` - List all orders (admin only)
- `PATCH /api/orders/[id]` - Update order status (admin only)
- `GET /api/orders/[id]` - Get order details

## Setup Steps

### Step 1: Create Orders Table in Supabase
Execute the SQL from `scripts/create-orders-table.sql`:

```sql
-- Copy and run in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    items JSONB NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    special_notes TEXT,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
```

### Step 2: Enable Real-time for Orders Table (Optional)
Go to Supabase → Realtime → Enable for `orders` table (useful for admin live updates)

### Step 3: Add Razorpay Integration (When Ready)
1. Install Razorpay package:
   ```bash
   npm install razorpay
   ```

2. Add API keys to `.env.local`:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

3. Create `/app/api/razorpay/order/route.ts` for payment order creation
4. Update checkout form to handle payment flow

## Current Flow

```
User in Cart
    ↓
Click "Proceed to Checkout"
    ↓
Checkout Page (/app/checkout)
    ├─ Collect customer details
    ├─ Show order summary
    └─ Validate form
    ↓
Submit Order
    ├─ Create order record in database
    ├─ Clear cart from local storage
    └─ Trigger success callback
    ↓
Success Page (/checkout/success)
    ├─ Display order confirmation
    ├─ Show order ID
    └─ Provide next steps links
```

## Testing the Checkout

1. **Add items to cart** from the shop
2. **Navigate to checkout** via cart page
3. **Fill in customer details**:
   - Name, Email, Phone
   - Billing Address
   - Shipping Address (can be same as billing)
   - Optional special notes
4. **Click "Complete Order"**
5. **Verify success page** displays with order ID

## Order Status Workflow (Admin)

In the admin panel → Orders section:
- Orders start with status: **Pending**
- Admin can update to: **Confirmed** → **Shipped** → **Delivered**
- Can also mark as **Cancelled** if needed

## Database Schema Reference

### Orders Table Fields:
- `id` - Unique order identifier (UUID)
- `user_id` - Link to authenticated user (nullable for guest checkouts)
- `customer_name`, `email`, `phone` - Customer contact info
- `customer_address`, `shipping_address` - Delivery details
- `items` - JSON array of cart items with quantities
- `total_amount` - Order total
- `special_notes` - Optional customer notes
- `status` - Order processing status
- `created_at`, `updated_at` - Timestamps

## Known Limitations (To Address Next)

1. **Payment Processing**: Currently shows "Proceed to Payment" placeholder
   - Needs Razorpay integration for actual payment handling
   - Should prevent order creation until payment succeeds

2. **Email Notifications**: Not yet implemented
   - Should send confirmation email to customer
   - Should send order alert to admin

3. **Guest Checkout**: Works but user_id will be null
   - Consider adding newsletter signup option
   - Could enable order lookup by email/phone

4. **Shipping Calculation**: Currently free shipping
   - Can add shipping cost logic based on address/weight
   - Implement different rates for regions

## Environment Variables Required

The following are already configured (check `.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXTAUTH_URL
NEXTAUTH_SECRET
```

## Troubleshooting

**Problem**: Order not being created
- Check Supabase orders table exists
- Verify customer email is valid
- Check browser console for validation errors

**Problem**: Cart not clearing after order
- Ensure using `clearCart()` from CartContext
- Verify `isMounted` state in CartProvider

**Problem**: Success page shows wrong order ID
- Check URL parameter: `order_id` query string
- Verify order was created in database with correct ID

## Next Steps Priority

1. ✅ Create orders table in Supabase (SQL script ready)
2. ⏳ Implement Razorpay payment integration
3. ⏳ Add email notification service
4. ⏳ Create order tracking page for customers
5. ⏳ Implement order history in user profile
