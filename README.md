# 📈 Investfolio – Modern Investment Tracker

> **Investfolio** is a modern **Progressive Web App (PWA)** built using **Angular 20** for the frontend and **Next.js** for the backend (purely API-based).  
> It integrates **Google Sheets** (powered by **Google Finance API**) for live stock data and uses **Firebase Authentication** for secure login and user management.

---

## Overview

Investfolio connects **Google Sheets**, **Firebase**, and a **Next.js backend API** to deliver real-time portfolio tracking.  
The **Google Sheet** acts as the dynamic data source where the **Google Finance API** fetches real-time market prices.  
The **Next.js backend** reads, processes, and exposes that data through APIs for the **Angular frontend**, which displays it beautifully with a responsive dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Angular 20 (Standalone Components, SCSS, PWA) |
| **Backend (API)** | Next.js 14 (App Router, REST APIs) |
| **Authentication** | Firebase Auth (Email/Password + Google OAuth) |
| **Data Source** | Google Sheets + Google Finance API |
| **Hosting** | Frontend: Vercel • Backend: Render |
| **Database** | MongoDB |

---

##  Features

-  **Live Investment Tracking** via Google Finance API  
-  **Firebase Authentication** (Email, Google Login, Forgot Password)  
-  **Google Sheets Integration** for portfolio data  
-  **Dark Mode Modern UI**  
-  **Responsive PWA** (Installable on desktop and mobile)  
-  **Next.js APIs** for clean backend structure  
-  **Offline Support** via Angular Service Worker  

---

##  Architecture


               ┌────────────────────────────────────────┐
               │              Angular Frontend          │
               │----------------------------------------│
               │  • PWA + Service Worker                │
               │  • Firebase Auth                       │
               │  • Portfolio Dashboard UI              │
               │  • Calls Backend APIs                  │
               └────────────────────────────────────────┘
                                 │
                                 ▼
               ┌────────────────────────────────────────┐
               │             Next.js Backend API        │
               │----------------------------------------│
               │  • Firebase Token Verification         │
               │  • Reads Google Sheets Data            │
               │  • Exposes REST Endpoints              │
               └────────────────────────────────────────┘
                                 │
                                 ▼
               ┌────────────────────────────────────────┐
               │         Google Sheets + Finance API    │
               │----------------------------------------│
               │  • GOOGLEFINANCE() for live data       │
               │  • Source for backend API responses    │
               └────────────────────────────────────────┘


##  Firebase Authentication

### Supported Methods
-  **Email / Password Authentication**  
-  **Password Reset via Email**  
-  **Google Sign-In**

---

### Setup

1. Go to [Firebase Console](https://console.firebase.google.com)  
2. Create a **new project**  
3. Enable **Email/Password** and **Google** in **Authentication → Sign-in method**  
4. Copy your app’s configuration into your environment file  

---

### Example – `environment.ts`

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```
##  Google Sheets Integration

### Overview
The app integrates **Google Sheets** as a dynamic data source for market prices and portfolio data.  
Each stock entry in your sheet uses the built-in **GOOGLEFINANCE()** function to fetch live data directly from Google Finance.

---

### How It Works

1. Google Sheets holds stock tickers and investment data  
2. Each row uses `GOOGLEFINANCE()` for real-time market prices:
   ```excel
   =GOOGLEFINANCE("NASDAQ:AAPL", "price")
   ```
3.	The Next.js backend connects via Google Sheets API
4.	Data is formatted and returned to the Angular frontend through the /api/sheets/getData endpoint

## Setup – Google Sheets API

1.	Create a Google Cloud Project in Google Cloud Console￼
2.	Enable the Google Sheets API
3.	Create a Service Account
4.	Share your Google Sheet with the service account email (as Editor)
5.	Save your service account credentials
6.	Add these environment variables to your backend .env.local file:
   ```bash
   GOOGLE_SHEETS_ID=your_google_sheet_id
   GOOGLE_CLIENT_EMAIL=your_service_account_email
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
   ```

###  MongoDB Integration

### Overview
**MongoDB** serves as the primary database for storing all user and investment-related data.  
It offers flexibility and scalability, allowing efficient handling of dynamic portfolio data.

MongoDB is used to store:
-  **User profiles and authentication metadata**  
-  **Portfolio details and stock holdings**  
-  **Transaction history (buy/sell records)**  
-  **Performance analytics and user preferences**

---

### Database Structure

Typical collections used in this project include:

| Collection | Description |
|-------------|--------------|
| `users` | Stores Firebase user IDs and basic profile info |
| `portfolios` | Contains user stock holdings, average price, quantity, etc. |
| `transactions` | Tracks buy/sell activity for analytics |
| `watchlists` | Optional: user-saved tickers to monitor |

---

### Example Document – `portfolios` Collection
```json
{
  "userId": "8dFfQbL1jAbcdE34sT",
  "symbol": "AAPL",
  "quantity": 12,
  "avgBuyPrice": 184.23,
  "currentPrice": 188.90,
  "totalValue": 2266.80,
  "lastUpdated": "2025-11-01T13:00:00.000Z"
}
```


### ⚙️ Installation and Setup Guide

This section walks you through setting up both the frontend (Angular 20)
and backend (Next.js API) of your Investfolio project.
You’ll also configure Firebase, Google Sheets API, and MongoDB for full
integration.

------------------------------------------------------------------------

##  Prerequisites

Before you begin, make sure you have installed:

-   Node.js (v18 or above)
-   npm
-   Angular CLI
-   A Firebase project for authentication
-   A Google Cloud project with Sheets API enabled
-   A MongoDB Atlas database (or local MongoDB instance)

------------------------------------------------------------------------

# 1. Clone the Repository

Clone the project from your GitHub repository:
```bash
    git clone https://github.com/MisterStranger03/Investfolio.git
    cd Investfolio
```
------------------------------------------------------------------------

# 2. Setup Frontend (Angular 20)

Navigate to the frontend directory and install dependencies:

```bash
    cd investfolio-frontend
    npm install
```

Run the Angular development server:

```bash
    npm start
```

Frontend will run at:
http://localhost:4200

------------------------------------------------------------------------

3. Setup Backend (Next.js API Server)

Navigate to your backend folder:

```bash
    cd investfolio-backend
    npm install
```

Run the backend server:

```bash
    npm run dev
```

Backend will run at:
http://localhost:3000

------------------------------------------------------------------------

4. Configure Environment Files

🧩 Frontend – src/environments/environment.ts

Add your Firebase configuration here:
```json
    export const environment = {
      production: false,
      firebaseConfig: {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
        projectId: "YOUR_FIREBASE_PROJECT_ID",
        storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
        messagingSenderId: "YOUR_FIREBASE_SENDER_ID",
        appId: "YOUR_FIREBASE_APP_ID"
      }
    };
```
------------------------------------------------------------------------

 Backend – .env.local

Create a file named .env.local inside your Next.js backend directory and
add:

```json
    # Google Sheets API Configuration
    GOOGLE_SHEETS_ID=YOUR_SHEET_ID
    GOOGLE_CLIENT_EMAIL=YOUR_SERVICE_ACCOUNT_EMAIL
    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"

    # MongoDB Configuration
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/myportfolio

    # Optional: Firebase Token Verification
    FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
```
------------------------------------------------------------------------

5. Connect Google Sheets

1.  Open your Google Sheet containing stock tickers

2.  Use the GOOGLEFINANCE() formula for real-time prices:
```excel
        =GOOGLEFINANCE("NASDAQ:GOOG", "price")
```
3.  Share the sheet with your service account email (Editor role)

4.  Copy the Sheet ID from the URL and add it to .env.local

------------------------------------------------------------------------

6. Connect MongoDB Atlas

1.  Go to MongoDB Atlas
2.  Create a free cluster
3.  Whitelist your IP (or allow 0.0.0.0/0)
4.  Copy your connection URI and replace <username> and <password> in
    .env.local

------------------------------------------------------------------------

7. Firebase Setup

1.  Go to Firebase Console
2.  Enable Email/Password and Google Sign-In under Authentication →
    Sign-in Method
3.  Copy your Firebase config credentials and paste them into
    environment.ts

------------------------------------------------------------------------

8. Build for Production

Frontend:

```bash
    npm run build
```
Builds optimized static files in dist/my-portfolio-frontend/.

Backend:

```bash
    npm run build
    npm start
```
Starts the production server.

------------------------------------------------------------------------

9. Deployment (Optional)

  -----------------------------------------------------------------------
  Layer             Platform                  Description
  ----------------- ------------------------- ---------------------------
  Frontend          Vercel / Firebase Hosting Deploy built Angular app
  (Angular)                                   

  Backend (Next.js) Render / Vercel           Deploy API routes

  Database          MongoDB Atlas             Cloud-hosted MongoDB

  Authentication    Firebase                  Handles login, Google
                                              sign-in, and password reset
  -----------------------------------------------------------------------

------------------------------------------------------------------------

10. Run the Full Application

Start both servers simultaneously:

Frontend:
```bash
    cd investfolio-frontend
    npm start
```
Backend:
```bash
    cd investfolio-backend
    npm run dev
```
Then open:
```url
    Frontend → http://localhost:4200
    Backend  → http://localhost:3000
```
------------------------------------------------------------------------

Summary

  ------------------------------------------------------------------------
  Component                Technology                 Purpose
  ------------------------ -------------------------- --------------------
  Frontend                 Angular 20 (PWA)           Modern UI,
                                                      offline-ready

  Backend                  Next.js (API Routes)       Data bridge between
                                                      Firebase, MongoDB &
                                                      Sheets

  Database                 MongoDB Atlas              Persistent user &
                                                      portfolio data

  Auth                     Firebase                   Secure
                                                      authentication

  Live Data                Google Sheets + Finance    Real-time stock
                           API                        prices
  ------------------------------------------------------------------------

------------------------------------------------------------------------

✅ Your Investfolio app is now set up and running locally!
You can now log in using Firebase, fetch live data from Google Sheets,
and manage your portfolio seamlessly.

