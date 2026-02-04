import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { message: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 9);
        const extension = file.name.split('.').pop();
        const filename = `hero-${timestamp}-${randomString}.${extension}`;

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure the public directory exists
        const publicDir = path.join(process.cwd(), 'public');
        try {
            await mkdir(publicDir, { recursive: true });
        } catch (err) {
            // Directory might already exist, that's fine
        }

        // Save file to public directory
        const filepath = path.join(publicDir, filename);
        await writeFile(filepath, buffer);

        // Return the public URL
        const imageUrl = `/${filename}`;

        return NextResponse.json({ url: imageUrl }, { status: 201 });
    } catch (error) {
        console.error('Error uploading hero image:', error);
        return NextResponse.json(
            { message: 'Failed to upload image' },
            { status: 500 }
        );
    }
}
