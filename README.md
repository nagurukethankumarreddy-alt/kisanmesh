# KisanMesh (ಕಿಸಾನ್‌ಮೆಶ್)

> **Bit N Build 2026 (GDG RVCE Karnataka Round)**  
> **Track:** Agricultural Micro-Economies & Supply Arbitrage  
> **Theme:** Agentic AI for Good  
> **Deployment:** Production Ready (Next.js 15, TypeScript, Gemini 2.5 Flash, Bhashini Dialect Engine, ONDC Beckn Protocol v1.2)

---

## 📌 Problem Context: The 48-Hour Perishable Trap

In Karnataka's vegetable belt (e.g., Kolar APMC), seasonal supply gluts trigger sudden price crashes where spot farm-gate rates plunge to **₹2–₹4/kg** against cultivation costs of **₹8–₹10/kg**. Meanwhile, terminal retail hubs in Bengaluru (68 km away) maintain rates of **₹20–₹35/kg**.

Because **86.2% of Indian farmers are Small and Marginal Farmers (SMFs)** holding micro-lots (<1–2 tonnes), individual private freight costs (₹3,500+) wipe out any potential regional price spread. Trapped by transport economics and rapid ambient rot risks, farmers are forced into localized distress selling.

---

## 🏗️ Autonomous Multi-Agent Pipeline

[Omnichannel Voice / Dialect Ingest] (Kannada / Hindi / Telugu / Marathi)
│
▼
[Sentinel Agent Node] ── Agmarknet Velocity Ingestion & OpenMeteo Q10 Rot Modeling
│
▼
[Cluster Engine Node] ── Spatial Pooling Grid (Radius ≤ 15 km) & DAP Backhaul Arbitrage
│
▼
[Auctioneer Agent Node] ── Multi-Turn B2B Reverse Dutch Auction with Regional Cold Chains
│
▼
[Settlement Agent Node] ── ONDC Beckn v1.2 Smart Escrow, Tare Weighing & UPI AutoPay Split


### 1. Sentinel Agent (Market Perception & Rot Modeling)
Monitors real-time mandi inflow velocities and Agmarknet arrival rates. Integrates OpenMeteo thermal telemetry to calculate non-linear perishable decay curves ($Q_{10}$ respiration coefficient) to forecast price collapses up to 48 hours in advance.

### 2. Cluster Engine (Spatial Aggregation & Backhaul Logistics)
Consolidates fragmented smallholder yields (e.g., Ramesh, Suresh, Anand) within a localized radius into unified commercial payloads (2.6+ tonnes). Matches returning trucks with subsidized return-trip cargo (IFFCO DAP fertilizer / empty crates) to reduce net freight expenses by over 60%.

### 3. Auctioneer Agent (Autonomous Market Making)
Conducts 3-turn programmatic reverse bargaining with destination cold-storage facilities, locking off-peak holding fees (e.g., reducing quotes from ₹12.60 to ₹9.10/crate) before perishable commodities degrade.

### 4. Settlement Agent (Verifiable Escrow & Tare Calibration)
Deducts empty crate tare weight (2.0 kg/crate) so farmers only pay freight on net yield. Issues ONDC-compliant smart escrow tokens, caps arbitrary middleman deductions (*katoti*) at 2%, and disburses automated 60% T+0 liquidity advances via UPI AutoPay.

---

## 🚀 Key Technical Highlights

* **Dual-View Architecture:** Seamlessly switches between the FPO Hub (enterprise logistics & analytical telemetry) and Oral Mode (zero-literacy, voice-first farmer interface).
* **Multilingual Oral Ingest:** Supports Kannada (`kn-IN`), Hindi (`hi-IN`), Marathi (`mr-IN`), and Telugu (`te-IN`) with native dialect phonetic extraction and unit normalization (crates, *petti*, *katta*, *bora* $\rightarrow$ kg).
* **Hardware-Simulated Feedback:** Integrates audible UPI Soundbox chimes and toll-free keypad IVR call simulations (`*99#`).
* **Open Protocol Conformance:** Strictly adheres to Beckn Core v1.2 specifications (`/search`, `/select`, `/init`, `/confirm`) across ONDC logistics and financial settlement layers.
* **Deterministic Tool Calling:** Full function-calling transparency for Agmarknet telemetry, OpenMeteo telemetry, cluster optimization, and reverse auction protocols.

---

## 💻 Local Development

```bash
# Clone the repository
git clone [https://github.com/kethan/kisanmesh.git](https://github.com/kethan/kisanmesh.git)

# Navigate to project directory
cd kisanmesh

# Install dependencies
npm install

# Run local development server
npm run dev
Open http://localhost:3000 in your browser.


Save the file (**Ctrl + S**) and close Notepad.

---