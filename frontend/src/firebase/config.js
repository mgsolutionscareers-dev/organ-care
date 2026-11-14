import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBlsvHUhGSn6vAaEnaLmrCAXFhFSDUHe_M",
  authDomain: "organcare-health-84c2b.firebaseapp.com",
  projectId: "organcare-health-84c2b",
  storageBucket: "organcare-health-84c2b.firebasestorage.app",
  messagingSenderId: "437746289127",
  appId: "1:437746289127:web:4ebde283652c78fb96d542"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
