import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

// Test endpoint to verify email configuration
export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { message: 'Email address is required' },
                { status: 400 }
            );
        }

        // Send a test email
        const result = await sendOrderConfirmationEmail({
            orderId: 12345,
            customerName: 'Test Customer',
            customerEmail: email,
            customerPhone: '+91 9876543210',
            shippingAddress: '123 Test Street\nTest City, Test State - 123456\nIndia',
            items: [
                {
                    product_name: 'Sample Fabric',
                    quantity: 2,
                    price_per_unit: 500
                },
                {
                    product_name: 'Premium Silk',
                    quantity: 1,
                    price_per_unit: 1500
                }
            ],
            totalAmount: 2500,
            paymentId: 'pay_test123456789',
            orderDate: new Date().toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        });

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'Test email sent successfully',
                messageId: result.messageId
            });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Failed to send test email',
                error: String(result.error)
            }, { status: 500 });
        }
    } catch (error) {
        console.error('Error in test email endpoint:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to send test email',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
