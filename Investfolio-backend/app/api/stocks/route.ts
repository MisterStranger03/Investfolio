import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Stock from '@/models/Stock';
import { getUserId } from '@/lib/getUserId';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserId(request);
    const stocks = await Stock.find({ user: userId }).sort({ purchaseDate: -1 });
    return NextResponse.json({ success: true, data: stocks });
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
    const stock = await Stock.create({ ...body, user: userId });
    return NextResponse.json({ success: true, data: stock.toObject() }, { status: 201 });
  } catch (error) {
    const isAuthError = (error as Error).message === 'Unauthorized';
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: isAuthError ? 401 : 400 });
  }
}