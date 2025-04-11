// Composables are like services - this is like AuthService

import { ref, onUnmounted, watchEffect } from 'vue'
import { auth, db } from '@/firebase'
import type { User as FirebaseUser } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import type { UserProfile } from '@/types/User'

// Reactive variable to hold the user info
const currentUser = ref<FirebaseUser | null>(null)
const userProfile = ref<UserProfile | null>(null)

// Listen for auth state changes
const unsubscribe = auth.onAuthStateChanged((user) => {
  currentUser.value = user
})

watchEffect(() => {
  if (currentUser.value) {
    const userDoc = doc(db, 'users', currentUser.value.uid)
    const unsubscribeProfile = onSnapshot(userDoc, (docSnap) => {
      userProfile.value = docSnap.data() as UserProfile
    })
    onUnmounted(() => unsubscribeProfile())
  } else {
    userProfile.value = null
  }
})

// Clean up the listener when not needed
onUnmounted(() => unsubscribe())

export function useAuth() {
  return { currentUser, userProfile }
}
