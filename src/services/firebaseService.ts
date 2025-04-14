// services/firebaseService.ts

import { db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
// setDoc, updateDoc, arrayUnion

// This file provides core helpers for Firestore reads/writes.
// It does NOT manage any state — it's purely functional.

// Used internally by userService, pubService, etc.

export function getUserRef(uid: string) {
  return doc(db, 'users', uid)
}

export function getPubRef(pubId: string) {
  return doc(db, 'pubs', pubId)
}

export async function safeGet<T>(ref: ReturnType<typeof doc>): Promise<T | null> {
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data() as T) : null
}
