import { NextRequest } from 'next/server';
import admin from './firebaseAdmin';

export async function getUserId(req: NextRequest): Promise<string> {
  const authorizationHeader = req.headers.get('authorization');
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  const token = authorizationHeader.split('Bearer ')[1];
  if (!token) {
    throw new Error('Unauthorized');
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken || !decodedToken.uid) {
      throw new Error('Token is invalid.');
    }
    return decodedToken.uid;
  } catch (error) {
    console.error('getUserId Error: Token verification failed.', error);
    throw new Error('Unauthorized');
  }
}