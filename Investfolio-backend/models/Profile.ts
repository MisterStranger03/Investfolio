import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  defaultCurrency: string;
  imageUrl: string; 
  user: string;
}

const ProfileSchema: Schema = new Schema({
  name: { type: String, trim: true },
  defaultCurrency: { type: String, default: 'INR', uppercase: true },
  imageUrl: { type: String, default: '' }, 
  user: { type: String, required: true, unique: true },
});

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);