import mongoose, { Document, Schema } from 'mongoose';

export interface IStock extends Document {
  name: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  purchaseDate: Date;
  user: string;
}

const StockSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  ticker: { type: String, required: true, uppercase: true, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  buyPrice: { type: Number, required: true, min: 0 },
  purchaseDate: { type: Date, default: Date.now },
  user: { type: String, required: true },
});

export default mongoose.models.Stock || mongoose.model<IStock>('Stock', StockSchema);