import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// ----------------- FAVORITE ORGANS -----------------

export const toggleFavoriteOrgan = async (userId, organ) => {
  if (!userId || !organ) return false;

  const localKey = `organcare_fav_organs_${userId}`;
  let existing = [];
  try {
    existing = JSON.parse(localStorage.getItem(localKey) || '[]');
  } catch (e) {}

  const isFav = existing.some(item => item.organId === organ.organId);
  let updated = [];
  let newState = false;

  if (isFav) {
    updated = existing.filter(item => item.organId !== organ.organId);
    newState = false;
  } else {
    const entry = {
      organId: organ.organId,
      name: organ.name,
      tagline: organ.tagline || '',
      system: organ.system || '',
      colorAccent: organ.colorAccent || '#14B8A6',
      addedAt: new Date().toISOString()
    };
    updated = [entry, ...existing];
    newState = true;
  }

  localStorage.setItem(localKey, JSON.stringify(updated));

  // Sync with Firestore
  try {
    const docRef = doc(db, 'users', userId, 'favoriteOrgans', organ.organId);
    if (newState) {
      await setDoc(docRef, { ...organ, addedAt: new Date().toISOString() });
    } else {
      await deleteDoc(docRef);
    }
  } catch (err) {
    console.warn('[FavoritesService] Firestore organ fav error:', err.message);
  }

  return newState;
};

export const fetchFavoriteOrgans = async (userId) => {
  if (!userId) return [];

  const localKey = `organcare_fav_organs_${userId}`;
  let localList = [];
  try {
    localList = JSON.parse(localStorage.getItem(localKey) || '[]');
  } catch (e) {}

  try {
    const colRef = collection(db, 'users', userId, 'favoriteOrgans');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const remoteList = snapshot.docs.map(d => ({ organId: d.id, ...d.data() }));
      localStorage.setItem(localKey, JSON.stringify(remoteList));
      return remoteList;
    }
  } catch (err) {
    console.warn('[FavoritesService] Firestore fetch fav organs fallback:', err.message);
  }

  return localList;
};

// ----------------- FAVORITE DOCTORS -----------------

export const toggleFavoriteDoctor = async (userId, doctor) => {
  if (!userId || !doctor) return false;

  const localKey = `organcare_fav_doctors_${userId}`;
  let existing = [];
  try {
    existing = JSON.parse(localStorage.getItem(localKey) || '[]');
  } catch (e) {}

  const isFav = existing.some(item => item.id === doctor.id);
  let updated = [];
  let newState = false;

  if (isFav) {
    updated = existing.filter(item => item.id !== doctor.id);
    newState = false;
  } else {
    const entry = {
      id: doctor.id,
      name: doctor.name,
      specialty: doctor.specialty,
      hospitalAffiliation: doctor.hospitalAffiliation,
      rating: doctor.rating,
      avatar: doctor.avatar,
      city: doctor.city,
      distanceKm: doctor.distanceKm,
      addedAt: new Date().toISOString()
    };
    updated = [entry, ...existing];
    newState = true;
  }

  localStorage.setItem(localKey, JSON.stringify(updated));

  // Sync with Firestore
  try {
    const docRef = doc(db, 'users', userId, 'favoriteDoctors', doctor.id);
    if (newState) {
      await setDoc(docRef, { ...doctor, addedAt: new Date().toISOString() });
    } else {
      await deleteDoc(docRef);
    }
  } catch (err) {
    console.warn('[FavoritesService] Firestore doc fav error:', err.message);
  }

  return newState;
};

export const fetchFavoriteDoctors = async (userId) => {
  if (!userId) return [];

  const localKey = `organcare_fav_doctors_${userId}`;
  let localList = [];
  try {
    localList = JSON.parse(localStorage.getItem(localKey) || '[]');
  } catch (e) {}

  try {
    const colRef = collection(db, 'users', userId, 'favoriteDoctors');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const remoteList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      localStorage.setItem(localKey, JSON.stringify(remoteList));
      return remoteList;
    }
  } catch (err) {
    console.warn('[FavoritesService] Firestore fetch fav doctors fallback:', err.message);
  }

  return localList;
};

