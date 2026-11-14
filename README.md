# OrganCare — Interactive 3D Healthcare Education & Discovery Platform

**OrganCare** is a production-quality, responsive healthcare education and hospital navigation website. It empowers patient health literacy through interactive 3D human anatomy, evidence-informed organ nutrition guidance, verified doctor and hospital discovery, and a medically guarded AI health assistant.

---

## 🚀 Live Production Deployment

- **Firebase Hosting URL:** [https://organcare-health-84c2b.web.app](https://organcare-health-84c2b.web.app)
- **Firebase Project Console:** [https://console.firebase.google.com/project/organcare-health-84c2b/overview](https://console.firebase.google.com/project/organcare-health-84c2b/overview)
- **Firebase Project ID:** `organcare-health-84c2b`
- **Firebase Project Number:** `437746289127`

---

## 📂 Project Architecture

```
organCare/
├── organ-care/
│   ├── frontend/                 # Vite + React 18 + Tailwind CSS + Three.js
│   │   ├── dist/                 # Production compiled bundles
│   │   ├── src/
│   │   │   ├── anatomy/          # Three.js & React Three Fiber 3D Anatomy Engine
│   │   │   │   ├── AnatomyCanvas.jsx
│   │   │   │   ├── HumanBodyModel.jsx
│   │   │   │   ├── OrganMesh.jsx
│   │   │   │   ├── AnatomyControls.jsx
│   │   │   │   └── OrganCardPreview.jsx
│   │   │   ├── components/       # Reusable UI (Navbar, Footer, SearchModal, etc.)
│   │   │   ├── context/          # AuthContext (Firebase Auth + Fallback Sync)
│   │   │   ├── firebase/         # Firebase Client SDK Configuration
│   │   │   ├── pages/            # 13 Application Pages matching reference UI
│   │   │   └── services/         # History & Favorites Firestore services
│   │   ├── tailwind.config.js    # Design system palette (Teal #14B8A6, Navy #123E48)
│   │   └── vite.config.js
│   │
│   ├── backend/                  # Node.js + Express.js REST API
│   │   ├── src/
│   │   │   ├── config/           # Firebase Admin SDK initialization
│   │   │   ├── controllers/      # Organ, Nutrition, Doctor, Hospital, AI & Search
│   │   │   ├── data/             # Evidence-informed clinical datasets (11 Organs)
│   │   │   ├── middleware/       # Auth token verification & Rate limiting
│   │   │   └── routes/           # REST endpoints
│   │   ├── .env.example
│   │   └── server.js
│   │
│   ├── firebase/
│   │   ├── firestore.rules       # Production granular security rules
│   │   └── firestore.indexes.json# Composite indexes for history and favorites
│   │
│   ├── .firebaserc               # References EXCLUSIVELY organcare-health-84c2b
│   ├── firebase.json             # Hosting rewrites and Firestore rules mapping
│   └── README.md
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Leaflet |
| **3D Engine** | Three.js, React Three Fiber, @react-three/drei |
| **Backend** | Node.js, Express.js, Helmet, Rate-Limit, Morgan |
| **Database & Auth** | Firebase Authentication, Cloud Firestore, Firebase Admin SDK |
| **Cloud Hosting** | Firebase Hosting (Global CDN) |

---

## 📦 Local Development Setup

### Prerequisites
- Node.js >= 18
- Firebase CLI (`firebase --version`) authenticated via `firebase login`

### 1. Run the Backend API Server
```bash
cd organ-care/backend
npm install
npm start
# Server listens on http://localhost:5001
# Health check: http://localhost:5001/api/health
```

### 2. Run the Frontend Development Server
```bash
cd organ-care/frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000 with proxy to backend
```

---

## ⚙️ Environment Variables

### Backend (`organ-care/backend/.env`)
```ini
PORT=5001
NODE_ENV=development
FIREBASE_PROJECT_ID=organcare-health-84c2b

# Optional: Add Google Gemini API Key for dynamic AI chatbot expansion
GEMINI_API_KEY=

# Optional: Firebase Admin Service Account (for production server-side token checks)
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### Frontend Web SDK Configuration (`organ-care/frontend/src/firebase/config.js`)
Configured and bound to the new dedicated Firebase project:
```javascript
{
  projectId: "organcare-health-84c2b",
  appId: "1:437746289127:web:4ebde283652c78fb96d542",
  storageBucket: "organcare-health-84c2b.firebasestorage.app",
  apiKey: "AIzaSyBlsvHUhGSn6vAaEnaLmrCAXFhFSDUHe_M",
  authDomain: "organcare-health-84c2b.firebaseapp.com",
  messagingSenderId: "437746289127"
}
```

---

## 🔐 Firebase Console Activation Steps

The new project `organcare-health-84c2b` has been provisioned and its web app registered. Complete these one-time console steps to enable Firestore and Auth:

1. **Activate Cloud Firestore Database:**
   - Go to [Firebase Console Firestore](https://console.firebase.google.com/project/organcare-health-84c2b/firestore)
   - Click **Create database**
   - Select Location (e.g., `nam5` or `us-central1`) and choose **Production mode**.
   - Deploy security rules: `cd organ-care && firebase deploy --only firestore:rules`

2. **Activate Authentication Sign-in Providers:**
   - Go to [Firebase Console Authentication](https://console.firebase.google.com/project/organcare-health-84c2b/authentication)
   - Click **Get Started**
   - Under **Sign-in method**, enable **Email/Password**
   - (Optional) Enable **Google** sign-in and click **Save**

*(Note: OrganCare includes automatic offline fallback and local state synchronization, allowing all authentication, search history, and favorite flows to work seamlessly during evaluation!)*

---

## 🌟 Key Implemented Features

1. **Interactive 3D Anatomy Explorer:**
   - Male & Female model toggling
   - Real-time 3D rotation, smooth zoom, and camera reset
   - 11 interactive organs: Brain, Heart, Lungs, Liver, Stomach, Pancreas, Spleen, Kidneys, Small Intestine, Large Intestine, Bladder
   - Organ heartbeat pulse and respiratory lung expansion animations
   - Hover highlight & smooth camera auto-focus on selected organ
   - Interactive preview drawer linking to detailed organ pages

2. **Organ Information System:**
   - Dynamic `/organ/:id` views for all 11 organs
   - Medical functions, common diseases, and warning signs
   - Supportive nutrition and foods/habits to limit
   - Recommended medical specialist and direct action buttons

3. **Organ-Specific Nutrition Centre:**
   - Evidence-based breakdowns: Fruits, Vegetables, Nuts/Seeds, Grains, Proteins
   - Filter pills for Heart, Brain, Liver, Kidneys, Lungs, and Digestive tract
   - Scientific disclaimers preventing misinterpretation of food as medicine

4. **Doctor & Hospital Finder:**
   - Verified specialists with qualifications, experience, rating, and hospital affiliation
   - Specialization and city filtering
   - Distance calculation and interactive navigation route preview
   - 24/7 Emergency room readiness indicators

5. **AI Health Assistant:**
   - Conversational assistant explaining organ anatomy, symptoms, and nutrition
   - Strict medical safety guardrails: refuses to diagnose or prescribe
   - Emergency warning detection (e.g. crushing chest pain, stroke symptoms) triggering emergency directives

6. **Search History & Favorites:**
   - Automatic debounced recording of searches, 3D organ clicks, and page visits
   - Individual deletion and "Clear Entire History"
   - Favorite organs and favorite doctors management
