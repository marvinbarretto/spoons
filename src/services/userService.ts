// services/userService.ts

import { getUserRef, safeGet } from './firebaseService'
import { setDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import type { User as FirebaseUser } from 'firebase/auth'
import type { UserProfile } from '@/types/User'

// This service contains logic related to user creation and updates.
// It is NOT reactive — it just performs Firestore actions.

export async function initUserProfile(user: FirebaseUser) {
  const userRef = getUserRef(user.uid)

  const existingUser = await safeGet<UserProfile>(userRef)
  if (!existingUser) {
    const newUser: UserProfile = {
      id: user.uid,
      name: user.displayName ?? 'Anonymous',
      photoURL: user.photoURL ?? '',
      spoons: [],
      badges: [],
    }
    await setDoc(userRef, newUser)
  }
}

export async function addSpoonToUser(userId: string, pubId: string) {
  const userRef = getUserRef(userId)
  await updateDoc(userRef, {
    spoons: arrayUnion(pubId),
  })
}

export async function addBadgesToUser(userId: string, badgeIds: string[]) {
  const userRef = getUserRef(userId)
  await updateDoc(userRef, {
    badges: arrayUnion(...badgeIds),
  })
}
