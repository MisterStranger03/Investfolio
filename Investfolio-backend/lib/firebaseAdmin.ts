import admin from 'firebase-admin';

function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) return;
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error('CRITICAL: FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
  }
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error) {
    console.error("CRITICAL: Firebase Admin SDK initialization failed.", error);
    throw new Error("Failed to initialize Firebase Admin SDK. Check your FIREBASE_SERVICE_ACCOUNT variable.");
  }
}

initializeFirebaseAdmin();
export default admin;