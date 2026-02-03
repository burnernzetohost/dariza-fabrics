import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadProductImage(file: File, productId: string): Promise<string> {
    try {
        // Create a unique filename
        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop();
        const fileName = `${productId}-${timestamp}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Upload file to Supabase Storage
        const { error: uploadError, data } = await supabase.storage
            .from('Product Images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('Product Images')
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

export async function uploadProductImages(files: File[], productId: string): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const file of files) {
        const url = await uploadProductImage(file, productId);
        uploadedUrls.push(url);
    }

    return uploadedUrls;
}
