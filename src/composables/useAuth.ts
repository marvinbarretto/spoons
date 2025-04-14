// useAuth.ts
import { ref, watchEffect } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import type { UserProfile } from '@/types/User'
import type { User } from 'firebase/auth'

const currentUser = ref<User | null>(null)
const userProfile = ref<UserProfile | null>(null)

onAuthStateChanged(auth, (user) => {
  currentUser.value = user
})

// 🔁 Whenever the Firebase user changes, watch and load their Firestore profile
watchEffect(() => {
  if (!currentUser.value) {
    userProfile.value = null
    return
  }

  const userRef = doc(db, 'users', currentUser.value.uid)

  // Real-time Firestore listener
  const unsubscribe = onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      userProfile.value = docSnap.data() as UserProfile
    } else {
      userProfile.value = null
    }
  })

  // Cleanup listener when component unmounts or user changes
  return () => unsubscribe()
})

export function useAuth() {
  return {
    currentUser,
    userProfile,
  }
}
