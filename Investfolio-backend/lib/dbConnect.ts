import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env.local');

declare global {
  var mongoose: { promise: Promise<Mongoose> | null; };
}

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { promise: null };

async function dbConnect(): Promise<Mongoose> {
  if (cached.promise) return cached.promise;

  const opts = { bufferCommands: false };
  cached.promise = mongoose.connect(MONGODB_URI, opts);
  return cached.promise;
}

export default dbConnect;