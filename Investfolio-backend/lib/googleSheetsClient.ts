import { google } from 'googleapis';

if (!process.env.GOOGLE_SHEETS_CREDENTIALS) {
  throw new Error('CRITICAL: GOOGLE_SHEETS_CREDENTIALS environment variable is not set.');
}

const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const auth = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: SCOPES,
});

export const sheets = google.sheets({ version: 'v4', auth });