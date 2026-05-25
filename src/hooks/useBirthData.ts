import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/auth/useAuth';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BirthData = {
  birthDate: string;        // ISO 8601 date string
  birthTime: string | null; // "HH:MM" 24-hour, null if not provided
  location: string | null;  // "City, Country", null if not provided
  lat: number | null;
  lon: number | null;
  createdAt?: string;       // ISO string, set on first save
  updatedAt?: string;       // ISO string, updated on every write
};

// Shape passed into save/update — no timestamps (set server-side)
export type BirthDataPayload = Pick<
  BirthData,
  'birthDate' | 'birthTime' | 'location' | 'lat' | 'lon'
>;

// ─── Firestore data structure ─────────────────────────────────────────────────
//
//  birthProfiles/
//    {uid}/          ← one document per user, keyed by Firebase Auth UID
//      birthDate     string  (ISO 8601)
//      birthTime     string | null
//      location      string | null
//      lat           number | null
//      lon           number | null
//      uid           string  (mirrors doc id; simplifies security rules)
//      createdAt     Timestamp
//      updatedAt     Timestamp
//
// Recommended Firestore security rules:
//   match /birthProfiles/{uid} {
//     allow read, write: if request.auth != null && request.auth.uid == uid;
//   }

// ─── Error mapping ────────────────────────────────────────────────────────────

function firestoreError(err: unknown): string {
  const code = (err as { code?: string })?.code;
  switch (code) {
    case 'permission-denied':
      return 'Permission denied. Please sign in again.';
    case 'unavailable':
    case 'deadline-exceeded':
      return 'Service unavailable. Check your connection.';
    case 'not-found':
      return 'Data not found.';
    case 'unauthenticated':
      return 'Session expired. Please sign in again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBirthData() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stable doc reference — only recreated when UID changes
  const docRef = useMemo(
    () => (uid ? doc(db, 'birthProfiles', uid) : null),
    [uid],
  );

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const getBirthData = useCallback(async () => {
    if (!docRef) {
      setLoading(false);
      setBirthData(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const d = snap.data();
        setBirthData({
          birthDate: d.birthDate as string,
          birthTime: (d.birthTime as string) ?? null,
          location: (d.location as string) ?? null,
          lat: (d.lat as number) ?? null,
          lon: (d.lon as number) ?? null,
          createdAt:
            d.createdAt instanceof Timestamp
              ? d.createdAt.toDate().toISOString()
              : undefined,
          updatedAt:
            d.updatedAt instanceof Timestamp
              ? d.updatedAt.toDate().toISOString()
              : undefined,
        });
      } else {
        setBirthData(null);
      }
    } catch (err) {
      setError(firestoreError(err));
    } finally {
      setLoading(false);
    }
  }, [docRef]);

  // Auto-fetch whenever the user changes (login / logout)
  useEffect(() => {
    getBirthData();
  }, [getBirthData]);

  // ── Save (first time) ───────────────────────────────────────────────────────
  const saveBirthData = async (payload: BirthDataPayload): Promise<boolean> => {
    if (!docRef || !uid) {
      setError('Not authenticated');
      return false;
    }
    try {
      setSaving(true);
      setError(null);
      await setDoc(docRef, {
        ...payload,
        uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      // Optimistic local update (timestamps will be strings until next fetch)
      setBirthData((prev) => ({ ...prev, ...payload }));
      return true;
    } catch (err) {
      setError(firestoreError(err));
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ── Update (existing data) ──────────────────────────────────────────────────
  const updateBirthData = async (payload: BirthDataPayload): Promise<boolean> => {
    if (!docRef) {
      setError('Not authenticated');
      return false;
    }
    try {
      setSaving(true);
      setError(null);
      await updateDoc(docRef, {
        ...payload,
        updatedAt: serverTimestamp(),
      });
      setBirthData((prev) => (prev ? { ...prev, ...payload } : { ...payload }));
      return true;
    } catch (err) {
      setError(firestoreError(err));
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const deleteBirthData = async (): Promise<boolean> => {
    if (!docRef) return false;
    try {
      setSaving(true);
      setError(null);
      await deleteDoc(docRef);
      setBirthData(null);
      return true;
    } catch (err) {
      setError(firestoreError(err));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    birthData,
    loading,
    saving,
    error,
    saveBirthData,
    updateBirthData,
    deleteBirthData,
    refetch: getBirthData,
  };
}
