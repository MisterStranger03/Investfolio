import { NextResponse } from 'next/server';
import { sheets } from '@/lib/googleSheetsClient';

let priceCache = new Map<string, { price: number; previousClose: number }>();
let lastFetchTime = 0;

async function getPricesFromSheet(): Promise<Map<string, { price: number; previousClose: number }>> {
  const now = Date.now();
  if (now - lastFetchTime < 60000 && priceCache.size > 0) {
    return priceCache;
  }

  console.log('[Price API] Fetching fresh data from Google Sheets...');
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A2:C', 
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      const newCache = new Map<string, { price: number; previousClose: number }>();
      rows.forEach(row => {
        const ticker = row[0];
        const priceString = String(row[1]).replace(/[^0-9.]/g, '');
        const prevCloseString = String(row[2]).replace(/[^0-9.]/g, ''); 
        const price = parseFloat(priceString);
        const previousClose = parseFloat(prevCloseString); 
        
        if (ticker && !isNaN(price) && !isNaN(previousClose)) {
          newCache.set(ticker.toUpperCase(), { price, previousClose });
        }
      });
      priceCache = newCache;
      lastFetchTime = now;
      console.log(`[Price API] Successfully cached ${priceCache.size} tickers.`);
    }
  } catch (err) {
    console.error('[Price API] ERROR fetching from Google Sheets:', err);
  }
  return priceCache;
}

export async function GET(request: Request, { params }: { params: { ticker: string } }) {
  const requestedTicker = params.ticker.toUpperCase();
  console.log(`[Price API] Request for ticker: ${requestedTicker}`);
  try {
    const prices = await getPricesFromSheet();
    const priceData = prices.get(requestedTicker); 

    if (priceData) {
      console.log(`[Price API] Success for ${requestedTicker}:`, priceData);
      return NextResponse.json({ success: true, data: priceData });
    } else {
      console.warn(`[Price API] Ticker ${requestedTicker} not found in cache.`);
      return NextResponse.json({ success: false, error: 'Ticker not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}