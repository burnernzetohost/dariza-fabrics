import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Create Razorpay order
export async function POST(request: NextRequest) {
    try {
        const { amount, currency = 'INR', receipt, notes } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { message: 'Invalid amount' },
                { status: 400 }
            );
        }

        // Create order in Razorpay
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise (smallest currency unit)
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            notes: notes || {},
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        return NextResponse.json(
            { message: 'Failed to create payment order', error: String(error) },
            { status: 500 }
        );
    }
}

// Verify Razorpay payment signature
export async function PUT(request: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { message: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Generate signature for verification
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');

        // Verify signature
        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            return NextResponse.json({
                success: true,
                message: 'Payment verified successfully',
                payment_id: razorpay_payment_id,
            });
        } else {
            return NextResponse.json(
                { success: false, message: 'Payment verification failed' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { message: 'Failed to verify payment', error: String(error) },
            { status: 500 }
        );
    }
}
