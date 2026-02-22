import { NextRequest, NextResponse } from 'next/server';

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL!;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;
const SHIPROCKET_TOKEN_ENV = process.env.SHIPROCKET_TOKEN;
const PICKUP_PINCODE = '180001';
const WEIGHT_PER_ITEM_KG = 0.65; // 650gms per product

// In-memory token cache
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getShiprocketToken(): Promise<string> {
    // 1. Use pre-configured token from env if available
    if (SHIPROCKET_TOKEN_ENV) {
        return SHIPROCKET_TOKEN_ENV;
    }

    // 2. Return in-memory cached token if still valid (with 1 hour buffer)
    if (cachedToken && Date.now() < cachedToken.expiresAt - 3600000) {
        return cachedToken.token;
    }

    // 3. Authenticate via email/password
    if (!SHIPROCKET_EMAIL || !SHIPROCKET_PASSWORD) {
        throw new Error('Shiprocket credentials not configured');
    }

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: SHIPROCKET_EMAIL,
            password: SHIPROCKET_PASSWORD,
        }),
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error('Shiprocket auth error:', response.status, errText);
        throw new Error('Failed to authenticate with Shiprocket');
    }

    const data = await response.json();
    const token = data.token;

    if (!token) {
        throw new Error('No token received from Shiprocket');
    }

    // Cache for 10 days
    cachedToken = {
        token,
        expiresAt: Date.now() + 10 * 24 * 60 * 60 * 1000,
    };

    return token;
}

export async function POST(request: NextRequest) {
    try {
        const { delivery_pincode, quantity } = await request.json();

        if (!delivery_pincode || !/^\d{6}$/.test(delivery_pincode)) {
            return NextResponse.json(
                { error: 'Invalid pincode. Please enter a valid 6-digit pincode.' },
                { status: 400 }
            );
        }

        const itemCount = Math.max(1, parseInt(quantity) || 1);
        const totalWeightKg = WEIGHT_PER_ITEM_KG * itemCount;

        const token = await getShiprocketToken();

        const params = new URLSearchParams({
            pickup_postcode: PICKUP_PINCODE,
            delivery_postcode: delivery_pincode,
            weight: totalWeightKg.toString(),
            cod: '0',
        });

        const ratesResponse = await fetch(
            `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!ratesResponse.ok) {
            const errText = await ratesResponse.text();
            console.error('Shiprocket rates error:', ratesResponse.status, errText);
            throw new Error('Failed to fetch shipping rates from Shiprocket');
        }

        const ratesData = await ratesResponse.json();

        const couriers: any[] = ratesData?.data?.available_courier_companies || [];

        // Find DTDC Air 500gm (courier_company_id: 196)
        const dtdcAir = couriers.find(
            (c: any) => c.courier_company_id === 196
        );

        if (!dtdcAir) {
            // Fallback: return cheapest available courier
            if (couriers.length === 0) {
                return NextResponse.json(
                    { error: 'No courier services available for this pincode.' },
                    { status: 404 }
                );
            }

            const cheapest = couriers.reduce((a: any, b: any) =>
                a.rate < b.rate ? a : b
            );

            return NextResponse.json({
                courier_name: cheapest.courier_name,
                rate: cheapest.rate,
                estimated_delivery_days: cheapest.estimated_delivery_days,
                etd: cheapest.etd,
                weight_kg: totalWeightKg,
                fallback: true,
            });
        }

        return NextResponse.json({
            courier_name: dtdcAir.courier_name,
            rate: dtdcAir.rate,
            estimated_delivery_days: dtdcAir.estimated_delivery_days,
            etd: dtdcAir.etd,
            weight_kg: totalWeightKg,
            fallback: false,
        });
    } catch (error) {
        console.error('Shipping rates error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to calculate shipping rates' },
            { status: 500 }
        );
    }
}
