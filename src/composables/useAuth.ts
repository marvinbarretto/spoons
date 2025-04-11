// src/composables/useAuth.ts

// Composables are like services

import { ref, onUnmounted } from 'vue'
import { auth } from '@/firebase'
import type { User as FirebaseUser } from 'firebase/auth'

// Reactive variable to hold the user info
const currentUser = ref<FirebaseUser | null>(null)

// Listen for auth state changes
const unsubscribe = auth.onAuthStateChanged((user) => {
  currentUser.value = user
})

// Clean up the listener when not needed
onUnmounted(() => unsubscribe())

export function useAuth() {
  return { currentUser }
}
