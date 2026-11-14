import { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

// In-memory cache to debounce and avoid duplicate recording from component re-renders
const recentEventsCache = new Map();

export const recordHistoryEvent = async (userId, { title, organId, type, path, details }) => {
  if (!userId) return; // Guest activity is not stored in a permanent account per requirements

  const cacheKey = `${userId}_${type}_${organId || title}_${path}`;
  const now = Date.now();
  const lastRecorded = recentEventsCache.get(cacheKey);

  // Debounce duplicate events within 5 seconds
  if (lastRecorded && now - lastRecorded < 5000) {
    return;
  }
  recentEventsCache.set(cacheKey, now);

  const historyId = `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const entry = {
    id: historyId,
    title: title || 'Organ Exploration',
    organId: organId || null,
    type: type || 'view', // 'search' | '3d_select' | 'organ_view'
    path: path || '/',
    details: details || '',
    timestamp: new Date().toISOString(),
    createdAtEpoch: now
  };

  // 1. Save to Local Storage Cache
  try {
    const localKey = `organcare_history_${userId}`;
    const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
    const updated = [entry, ...existing.filter(item => item.id !== historyId)].slice(0, 100);
    localStorage.setItem(localKey, JSON.stringify(updated));
  } catch (err) {
    console.error('Local history cache error:', err);
  }

  // 2. Sync to Cloud Firestore
  try {
    const docRef = doc(db, 'users', userId, 'searchHistory', historyId);
    await setDoc(docRef, entry);
  } catch (err) {
    console.warn('[HistoryService] Firestore write fallback to local storage:', err.message);
  }

  return entry;
};

export const fetchSearchHistory = async (userId) => {
  if (!userId) return [];

  const localKey = `organcare_history_${userId}`;
  let localList = [];
  try {
    localList = JSON.parse(localStorage.getItem(localKey) || '[]');
  } catch (e) {}

  try {
    const historyCol = collection(db, 'users', userId, 'searchHistory');
    const q = query(historyCol, orderBy('timestamp', 'desc'), limit(50));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const remoteList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Update local cache
      localStorage.setItem(localKey, JSON.stringify(remoteList));
      return remoteList;
    }
  } catch (err) {
    console.warn('[HistoryService] Firestore read fallback to local cache:', err.message);
  }

  return localList;
};

export const deleteHistoryItem = async (userId, historyId) => {
  if (!userId || !historyId) return;

  const localKey = `organcare_history_${userId}`;
  try {
    const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
    const filtered = existing.filter(item => item.id !== historyId);
    localStorage.setItem(localKey, JSON.stringify(filtered));
  } catch (e) {}

  try {
    const docRef = doc(db, 'users', userId, 'searchHistory', historyId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('[HistoryService] Firestore delete error:', err.message);
  }
};

export const clearAllHistory = async (userId) => {
  if (!userId) return;

  const localKey = `organcare_history_${userId}`;
  localStorage.setItem(localKey, JSON.stringify([]));

  try {
    const historyCol = collection(db, 'users', userId, 'searchHistory');
    const snapshot = await getDocs(historyCol);
    const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  } catch (err) {
    console.warn('[HistoryService] Firestore clear error:', err.message);
  }
};

