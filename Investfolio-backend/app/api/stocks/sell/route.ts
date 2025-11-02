import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Stock from '@/models/Stock';
import { getUserId } from '@/lib/getUserId';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserId(request);
    const { ticker, quantity } = await request.json();

    if (!ticker || !quantity || quantity <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid input: Ticker and quantity are required.' }, { status: 400 });
    }

    const holdings = await Stock.find({ user: userId, ticker: ticker.toUpperCase() }).sort({ purchaseDate: 'asc' });

    if (!holdings || holdings.length === 0) {
      return NextResponse.json({ success: false, error: 'No holdings found for this ticker.' }, { status: 404 });
    }

    let quantityToSell = quantity;

    for (const holding of holdings) {
      if (quantityToSell === 0) break; 

      if (holding.quantity <= quantityToSell) {
        await Stock.findByIdAndDelete(holding._id);
        quantityToSell -= holding.quantity;
      } else {
        holding.quantity -= quantityToSell;
        await holding.save();
        quantityToSell = 0; 
      }
    }

    if (quantityToSell > 0) {
      console.warn(`User ${userId} sold all holdings of ${ticker}, but the original sell quantity was ${quantityToSell} shares higher than the total holdings.`);
    }

    return NextResponse.json({ success: true, message: 'Sell transaction processed successfully.' });
  } catch (error) {
    const isAuthError = (error as Error).message === 'Unauthorized';
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: isAuthError ? 401 : 500 });
  }
}