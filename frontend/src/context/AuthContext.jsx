import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user profile from Firestore or local storage
  const syncUserProfile = async (user) => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setUserProfile(snap.data());
      } else {
        const newProfile = {
          uid: user.uid,
          fullName: user.displayName || user.email?.split('@')[0] || 'OrganCare Explorer',
          email: user.email,
          photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        await setDoc(userRef, { ...newProfile, serverCreatedAt: serverTimestamp() }, { merge: true });
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.warn('[AuthContext] Firestore sync fallback to local cache:', err.message);
      // Fallback local profile cache
      const cached = localStorage.getItem(`organcare_profile_${user.uid}`);
      if (cached) {
        setUserProfile(JSON.parse(cached));
      } else {
        const fallback = {
          uid: user.uid,
          fullName: user.displayName || user.email?.split('@')[0] || 'OrganCare Explorer',
          email: user.email,
          photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        localStorage.setItem(`organcare_profile_${user.uid}`, JSON.stringify(fallback));
        setUserProfile(fallback);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const registerWithEmail = async (email, password, fullName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (fullName) {
      await updateProfile(cred.user, { displayName: fullName });
    }
    const profile = {
      uid: cred.user.uid,
      fullName: fullName || email.split('@')[0],
      email: cred.user.email,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cred.user.uid}`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'users', cred.user.uid), profile, { merge: true });
    } catch (e) {
      console.warn('[Register] Firestore save fallback:', e.message);
    }
    localStorage.setItem(`organcare_profile_${cred.user.uid}`, JSON.stringify(profile));
    setUserProfile(profile);
    return cred.user;
  };

  const loginWithEmail = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await syncUserProfile(cred.user);
    return cred.user;
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    await syncUserProfile(cred.user);
    return cred.user;
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
    setCurrentUser(null);
  };

  const resetPassword = async (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateCurrentUserProfile = async (updates) => {
    if (!currentUser) return;
    const updated = { ...userProfile, ...updates, updatedAt: new Date().toISOString() };
    setUserProfile(updated);
    localStorage.setItem(`organcare_profile_${currentUser.uid}`, JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
    } catch (e) {
      console.warn('[UpdateProfile] Firestore fallback:', e.message);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
    resetPassword,
    updateCurrentUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
