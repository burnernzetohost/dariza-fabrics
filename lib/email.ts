import nodemailer from 'nodemailer';

// Create SMTP transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // Use TLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

interface OrderItem {
    product_name: string;
    quantity: number;
    price_per_unit: number;
}

interface OrderConfirmationData {
    orderId: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    items: OrderItem[];
    totalAmount: number;
    paymentId: string;
    orderDate: string;
}

export async function sendOrderConfirmationEmail(data: OrderConfirmationData) {
    try {
        // Verify connection
        console.log('🔍 Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection verified');

        // Generate order items HTML
        const itemsHTML = data.items.map(item => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.product_name}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.price_per_unit}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">₹${item.price_per_unit * item.quantity}</td>
            </tr>
        `).join('');

        const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Dariza Fabrics</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #012d20; padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 300; letter-spacing: 2px;">DARIZA FABRICS</h1>
                        </td>
                    </tr>
                    
                    <!-- Order Confirmation Message -->
                    <tr>
                        <td style="padding: 40px 30px 20px;">
                            <h2 style="margin: 0 0 10px; color: #012d20; font-size: 24px; font-weight: 400;">Thank You for Your Order!</h2>
                            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                Dear ${data.customerName},
                            </p>
                            <p style="margin: 10px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                We've received your order and are preparing it for shipment. You will receive another email once your order has been shipped.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Order Details -->
                    <tr>
                        <td style="padding: 0 30px 20px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 6px; padding: 20px;">
                                <tr>
                                    <td style="padding-bottom: 10px;">
                                        <p style="margin: 0; color: #374151; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Order Details</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="padding: 5px 0;">
                                                    <span style="color: #6b7280; font-size: 14px;">Order ID:</span>
                                                </td>
                                                <td style="padding: 5px 0; text-align: right;">
                                                    <span style="color: #111827; font-size: 14px; font-weight: 600;">#${data.orderId}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 5px 0;">
                                                    <span style="color: #6b7280; font-size: 14px;">Order Date:</span>
                                                </td>
                                                <td style="padding: 5px 0; text-align: right;">
                                                    <span style="color: #111827; font-size: 14px;">${data.orderDate}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 5px 0;">
                                                    <span style="color: #6b7280; font-size: 14px;">Payment ID:</span>
                                                </td>
                                                <td style="padding: 5px 0; text-align: right;">
                                                    <span style="color: #111827; font-size: 14px; font-family: monospace; font-size: 12px;">${data.paymentId}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Order Items -->
                    <tr>
                        <td style="padding: 0 30px 20px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                                <thead>
                                    <tr style="background-color: #f9fafb;">
                                        <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.5px;">Product</th>
                                        <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                                        <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
                                        <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.5px;">Total</th>
                                    </tr>
                                </thead>
                                <tbody style="background-color: #ffffff;">
                                    ${itemsHTML}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Total -->
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding: 15px 0; border-top: 2px solid #012d20;">
                                        <span style="color: #111827; font-size: 16px; font-weight: 600;">Total Amount:</span>
                                    </td>
                                    <td style="padding: 15px 0; border-top: 2px solid #012d20; text-align: right;">
                                        <span style="color: #012d20; font-size: 20px; font-weight: 700;">₹${data.totalAmount}</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Shipping Address -->
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 6px; padding: 20px;">
                                <tr>
                                    <td>
                                        <p style="margin: 0 0 10px; color: #374151; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Shipping Address</p>
                                        <p style="margin: 0; color: #111827; font-size: 14px; line-height: 1.6;">${data.customerName}</p>
                                        <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">${data.shippingAddress.replace(/\n/g, '<br>')}</p>
                                        <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px;">📞 ${data.customerPhone}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                                Questions? Contact us at <a href="mailto:${process.env.SMTP_USER}" style="color: #012d20; text-decoration: none;">${process.env.SMTP_USER}</a>
                            </p>
                            <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px;">
                                © ${new Date().getFullYear()} Dariza Fabrics. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        // Plain text version for email clients that don't support HTML
        const emailText = `
DARIZA FABRICS - Order Confirmation

Dear ${data.customerName},

Thank you for your order! We've received your order and are preparing it for shipment.

ORDER DETAILS:
Order ID: #${data.orderId}
Order Date: ${data.orderDate}
Payment ID: ${data.paymentId}

ORDER ITEMS:
${data.items.map(item => `${item.product_name} x ${item.quantity} - ₹${item.price_per_unit * item.quantity}`).join('\n')}

TOTAL AMOUNT: ₹${data.totalAmount}

SHIPPING ADDRESS:
${data.customerName}
${data.shippingAddress}
Phone: ${data.customerPhone}

You will receive another email once your order has been shipped.

Questions? Contact us at ${process.env.SMTP_USER}

© ${new Date().getFullYear()} Dariza Fabrics. All rights reserved.
        `;

        console.log('📧 Sending email...');
        console.log('   Configuration:');
        console.log('   - Host:', process.env.SMTP_HOST || 'smtp.gmail.com');
        console.log('   - Port:', process.env.SMTP_PORT || '587');
        console.log('   - From:', process.env.SMTP_USER);
        console.log('   - To:', data.customerEmail);
        console.log('   - Subject:', `Order Confirmation - #${data.orderId}`);

        const info = await transporter.sendMail({
            from: `"Dariza Fabrics" <${process.env.SMTP_USER}>`,
            to: data.customerEmail,
            subject: `Order Confirmation - #${data.orderId} - Dariza Fabrics`,
            text: emailText,
            html: emailHTML,
            headers: {
                'List-Unsubscribe': `<mailto:${process.env.SMTP_USER}?subject=unsubscribe>`,
            },
            replyTo: process.env.SMTP_USER,
        });

        // Detailed logging
        console.log('\n✅ Email sent!');
        console.log('📊 Full Response Details:');
        console.log(JSON.stringify(info, null, 2));
        console.log('\n🔍 Envelope:');
        console.log('   From:', info.envelope?.from);
        console.log('   To:', info.envelope?.to);
        console.log('\n📝 Message Info:');
        console.log('   Message ID:', info.messageId);
        console.log('   Response:', info.response);
        console.log('   Accepted:', info.accepted);
        console.log('   Rejected:', info.rejected);
        console.log('   Pending:', info.pending);

        return {
            success: true,
            messageId: info.messageId,
            response: info.response,
            envelope: info.envelope
        };
    } catch (error) {
        console.error('\n❌ Error Details:');
        console.error(error);
        return { success: false, error };
    }
}
