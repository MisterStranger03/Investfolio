import { NextResponse, NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getUserId } from '@/lib/getUserId';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    await getUserId(request);
    
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      { timestamp: timestamp },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({ success: true, signature, timestamp });
  } catch (error) {
    const isAuthError = (error as Error).message === 'Unauthorized';
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: isAuthError ? 401 : 500 });
  }
}