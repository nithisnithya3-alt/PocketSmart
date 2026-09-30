# PocketSmart AI – Your Smart Budget & Recommendation Assistant

PocketSmart AI is an AI-powered budget planning and personalized recommendation web application. It integrates Google Gemini 3.8 Flash for contextual budget optimization, category allocations, and multimodal outfit image analysis for jewelry pairing.

---

## 🌟 Core Modules

### 1. Home Interior Budget Planner
- **Target Budget & Presets:** Enter any budget in INR (₹), USD ($), EUR (€), or GBP (£).
- **Rooms Customization:** Living Room, Master Bedroom, Modern Kitchen, Dining Area, Home Office, Balcony Garden, Kids Room.
- **Product Allocations:** Sofas & seating, lighting & chandeliers, ceiling fans, dining tables, storage, and decor.
- **Store Links:** Direct search and purchase links to **Amazon, Flipkart, IKEA, Pepperfry, and Urban Ladder**.
- **Constraint Enforcement:** Ensures total spending strictly adheres to the client's budget with cost-saving alternative scenarios.

### 2. Party & Celebration Budget Planner
- **Event Types:** Birthdays, Weddings & Receptions, Corporate Mixers, House Warming, Anniversaries, and Cocktail Nights.
- **Per-Guest Metrics:** Real-time calculation of cost per guest and catering allocations.
- **Platforms:** Direct integration and search links for **Swiggy, Zomato, OYO Townhouses/Banquets, and BookMyShow**.
- **Logistics Timeline:** Multi-week operational checklist from venue reservation to day-of-event coordination.

### 3. Jewelry & Outfit Matcher Planner
- **Occasions & Metals:** 22K Gold, 18K Diamond, 925 Sterling Silver, Platinum, and Kundan/Polki.
- **Multimodal Outfit Vision:** Upload an outfit photo or select pre-curated festive styles. Gemini AI analyzes colors, neckline, and fabric undertones to recommend complementing jewelry cuts.
- **Certified Benchmarks:** Sourced from **Tanishq, CaratLane, Bluestone, and Giva** with BIS Hallmarking and gemstone care notes.

---

## 🏗️ Architecture & Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js + Express API server with Vite dev proxy.
- **AI Engine:** Google Gemini 3.8 Flash (`@google/genai` TypeScript SDK) with server-side proxying.
- **Database & Sessions:** In-memory store with session tokens, SHA-256 password hashing, and plan history.

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
PORT=3000
```

### 3. Running the App
For development:
```bash
npm run dev
```

For production:
```bash
npm run build
npm start
```
The app will be available on `http://localhost:3000`.

---

## 🧪 Testing & Sample Walkthrough

1. **Instant Demo Account:** Click "Sign In" in the navigation bar and click **"Instant Test with Demo Account (Priya)"**.
2. **Home Planner Test:** Navigate to "Home Interior", click "Run Sample ₹1,50,000 Interior Plan", and inspect the breakdown.
3. **Party Planner Test:** Set 45 guests, ₹75,000 budget, and observe the Per-Guest metric (₹1,667/guest) and Swiggy/OYO suggestions.
4. **Jewelry Outfit Vision Test:** In "Jewelry & Outfit", click one of the sample outfits (e.g. *Maroon & Gold Silk Kanjeevaram Saree*) or upload a dress image, then generate to see the AI extracted palette and matching gold/diamond pieces.
5. **Print & Export:** Click "Full Breakdown & Print" on any generated plan to view the printable sheet.
