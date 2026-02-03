import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Initialize Supabase with service role key (server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Set' : 'NOT SET');
console.log('Service Role Key:', supabaseServiceKey ? 'Set' : 'NOT SET');

const supabase = createClient(
    supabaseUrl || '',
    supabaseServiceKey || '',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

export async function POST(request: Request) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        console.log('Session:', session);
        
        if (!session?.user) {
            console.log('No session found');
            return NextResponse.json(
                { message: 'Unauthorized. Please log in.' },
                { status: 401 }
            );
        }

        if (!session.user.admin) {
            console.log('User is not admin:', session.user.email);
            return NextResponse.json(
                { message: 'Unauthorized. Admin access required.' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const files = formData.getAll('files') as File[];
        const productId = formData.get('productId') as string;

        console.log('Files received:', files.length);
        console.log('Product ID:', productId);

        if (!files || files.length === 0) {
            return NextResponse.json(
                { message: 'No files provided' },
                { status: 400 }
            );
        }

        if (!productId) {
            return NextResponse.json(
                { message: 'Product ID is required' },
                { status: 400 }
            );
        }

        const uploadedUrls: string[] = [];

        for (const file of files) {
            try {
                console.log(`Uploading file: ${file.name}`);
                
                // Convert file to buffer
                const buffer = await file.arrayBuffer();
                const uint8Array = new Uint8Array(buffer);

                // Create unique filename
                const timestamp = Date.now();
                const fileExt = file.name.split('.').pop();
                const fileName = `${productId}-${timestamp}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
                const filePath = `products/${fileName}`;

                console.log(`File path: ${filePath}`);

                // Upload to Supabase Storage
                const { error: uploadError, data } = await supabase.storage
                    .from('Product Images')
                    .upload(filePath, uint8Array, {
                        contentType: file.type,
                        cacheControl: '3600',
                        upsert: false,
                    });

                if (uploadError) {
                    console.error('Upload error details:', uploadError);
                    throw new Error(`Upload failed: ${uploadError.message}`);
                }

                console.log('Upload successful, getting public URL');

                // Get public URL
                const { data: publicUrlData } = supabase.storage
                    .from('Product Images')
                    .getPublicUrl(filePath);

                uploadedUrls.push(publicUrlData.publicUrl);
                console.log('Public URL:', publicUrlData.publicUrl);
            } catch (error) {
                console.error('Error uploading individual file:', error);
                throw error;
            }
        }

        return NextResponse.json(
            { 
                message: 'Images uploaded successfully',
                urls: uploadedUrls
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in upload API:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Full error:', errorMessage);
        
        return NextResponse.json(
            { 
                message: 'Failed to upload images',
                error: errorMessage,
                details: error instanceof Error ? error.stack : 'No stack trace'
            },
            { status: 500 }
        );
    }
}
