import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Profile from '@/models/Profile';
import { getUserId } from '@/lib/getUserId';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserId(request);
    const profile = await Profile.findOne({ user: userId });
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    const isAuthError = (error as Error).message === 'Unauthorized';
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: isAuthError ? 401 : 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserId(request);
    const body = await request.json();
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { ...body, user: userId },
      { new: true, upsert: true, runValidators: true }
    );
    return NextResponse.json({ success: true, data: updatedProfile });
  } catch (error) {
    const isAuthError = (error as Error).message === 'Unauthorized';
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: isAuthError ? 401 : 400 });
  }
}