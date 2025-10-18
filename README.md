# 🧭 Silent Watch – Smart Price Alert App

## 🎯 Overview

**Silent Watch** is a minimalist React Native mobile app that allows users to **track asset prices (Crypto, Stocks, Gold)** and receive **non-intrusive price alerts** when certain thresholds are reached.

No charts. No spam. Just silent precision.  
Designed for investors who only want to be notified **when the market reaches their key levels**.

---

## 💡 Core Features

### 1️⃣ Watchlist

- Add or remove assets (Crypto, Stock, Gold).
- Display:
  - Symbol (e.g., BTC, AAPL, XAU)
  - Current price
  - 24h change (optional)
- Data saved locally using AsyncStorage or SQLite.

### 2️⃣ Smart Alerts

- Set alert conditions such as:
  - `BTC > 70000`
  - `AAPL < 150`
  - `Gold > 2500`
- The app checks prices **periodically (every 1–5 minutes)** via public APIs.
- When the price reaches the threshold → **local notification** is triggered.
- Once triggered, alerts are either:
  - Marked as _triggered_, or
  - Auto-reset (if user enables that option).

### 3️⃣ Local Notifications

- Implemented using:
  - `expo-notifications` (recommended) or
  - `react-native-push-notification`
- Example message:
  > "BTC just crossed 70,000 USD 🚀"

### 4️⃣ Storage

- Local-only persistence with:
  - **AsyncStorage** (simple)
  - or **SQLite** (optional for faster querying)
- No backend, no cloud sync.

### 5️⃣ Manual & Auto Refresh

- Manual refresh (pull-to-refresh).
- Optional background task to check price updates automatically.

---

## ⚙️ Tech Stack

| Layer             | Purpose                          | Technology                     |
| ----------------- | -------------------------------- | ------------------------------ |
| **UI**            | Screens and components           | React Native (Expo)            |
| **API Fetching**  | Price data                       | Axios + React Query            |
| **Storage**       | Local data (watchlist & alerts)  | AsyncStorage / SQLite          |
| **Notifications** | Local alerts                     | expo-notifications             |
| **Logic**         | Price comparison + alert trigger | Custom hook (`useCheckAlerts`) |

---

## 🌐 APIs Used

### 🪙 Crypto Prices

**Source:** [CoinGecko API](https://www.coingecko.com/en/api/documentation)

```bash
GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd
```

**Response:**

```json
{
  "bitcoin": { "usd": 69850 },
  "ethereum": { "usd": 3700 },
  "solana": { "usd": 185 }
}
```

---

### 📈 Stock Prices

**Source:** [Finnhub.io](https://finnhub.io/docs/api)

```bash
GET https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_TOKEN
```

**Response:**

```json
{
  "c": 170.52
}
```

---

### 🪙 Gold Prices

**Source:** [Metals-API](https://metals-api.com/)

```bash
GET https://metals-api.com/api/latest?base=USD&symbols=XAU&access_key=YOUR_KEY
```

**Response:**

```json
{
  "rates": { "XAU": 2450.32 }
}
```

---

## 🧮 Alert Checking Logic

1. Every few minutes (via `setInterval` or background task):

   - Load all active alerts from local storage.
   - Fetch the latest prices for each symbol.
   - Compare each alert condition:

     ```ts
     if (alert.type === "above" && price >= alert.target)
       triggerNotification(alert);

     if (alert.type === "below" && price <= alert.target)
       triggerNotification(alert);
     ```

2. Once triggered:
   - Mark the alert as “triggered” or reset if allowed.
   - Save updated state to AsyncStorage.

---

## 🧩 Suggested Folder Structure

```
SilentWatch/
├── src/
│   ├── api/
│   │   ├── cryptoApi.ts
│   │   ├── stockApi.ts
│   │   └── goldApi.ts
│   ├── components/
│   │   ├── WatchlistItem.tsx
│   │   ├── AlertItem.tsx
│   │   └── AddAlertModal.tsx
│   ├── hooks/
│   │   ├── useFetchPrice.ts
│   │   └── useCheckAlerts.ts
│   ├── screens/
│   │   ├── WatchlistScreen.tsx
│   │   └── AlertsScreen.tsx
│   ├── storage/
│   │   ├── watchlistStorage.ts
│   │   └── alertsStorage.ts
│   └── utils/
│       └── notificationHelper.ts
└── App.tsx
```

---

## 🧠 Design Philosophy

- **No distractions:** no charts, no analysis, no ads.
- **Silent precision:** one notification when it matters.
- **Minimal UI:** everything serves a single purpose — tracking and alerting.
- **Privacy first:** no backend, all data stays on your device.

---

## 🚀 Quick Setup

### 1️⃣ Install dependencies

```bash
npx create-expo-app SilentWatch
cd SilentWatch
npm install axios @tanstack/react-query expo-notifications
```

### 2️⃣ Create `.env`

```
FINNHUB_API_KEY=your_key_here
METALS_API_KEY=your_key_here
```

### 3️⃣ Run the app

```bash
npx expo start
```

---

## 🔮 Future Enhancements

- Multiple alerts per symbol.
- Silent mode scheduler (e.g., disable alerts at night).
- Import/export watchlist as JSON.
- Optional cloud sync (Firebase).
- Battery-optimized background checks.

---

## 📜 License

MIT License © 2025 Silent Watch Project Team
