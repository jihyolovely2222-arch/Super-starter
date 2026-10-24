import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Season } from './types';
import { INITIAL_SEASONS } from './data/defaultData';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'seasons', '_connection_check_'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is offline or unreachable');
      return false;
    }
    // permission-denied on a non-existent test document is normal when read is allowed
    return true;
  }
}

const SEASONS_COLLECTION = 'seasons';

/**
 * Real-time subscription to seasons from Firestore
 */
export function subscribeToSeasons(
  onUpdate: (seasons: Season[]) => void,
  onError?: (err: unknown) => void
) {
  const colRef = collection(db, SEASONS_COLLECTION);
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // If Firestore is completely empty on first launch, seed default demo seasons!
        try {
          for (const s of INITIAL_SEASONS) {
            const sanitized = JSON.parse(JSON.stringify(s));
            await setDoc(doc(db, SEASONS_COLLECTION, s.id), sanitized);
          }
        } catch (e) {
          console.error('Failed to seed initial seasons', e);
        }
        return;
      }

      const seasonsList: Season[] = [];
      snapshot.forEach((d) => {
        if (d.id !== '_connection_check_') {
          seasonsList.push(d.data() as Season);
        }
      });

      // Sort by seasonNumber ascending
      seasonsList.sort((a, b) => a.seasonNumber - b.seasonNumber);
      onUpdate(seasonsList);
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, SEASONS_COLLECTION);
      if (onError) onError(err);
    }
  );
}

/**
 * Save or update a season in Firestore
 */
export async function saveSeasonDoc(season: Season): Promise<void> {
  const path = `${SEASONS_COLLECTION}/${season.id}`;
  // Strip any undefined values which cause Firestore setDoc() to fail
  const sanitized = JSON.parse(JSON.stringify(season));
  try {
    await setDoc(doc(db, SEASONS_COLLECTION, season.id), sanitized);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Delete a season from Firestore
 */
export async function deleteSeasonDoc(seasonId: string): Promise<void> {
  const path = `${SEASONS_COLLECTION}/${seasonId}`;
  try {
    await deleteDoc(doc(db, SEASONS_COLLECTION, seasonId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
