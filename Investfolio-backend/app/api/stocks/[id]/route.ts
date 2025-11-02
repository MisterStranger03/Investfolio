import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Stock from '@/models/Stock';
import { getUserId } from '@/lib/getUserId';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const userId = await getUserId(request);
    const deletedStock = await Stock.findOneAndDelete({ _id: params.id, user: userId });
    if (!deletedStock) {
      return NextResponse.json({ success: false, error: 'Stock not found or user not authorized' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    const isAuthError = (error as Error).message === 'Unauthorized';
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: isAuthError ? 401 : 500 });
  }
}