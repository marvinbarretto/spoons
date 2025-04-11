<template>
  <div class="login-view">
    <h1>Welcome to Spoons 🍺</h1>
    <button @click="signInWithGoogle">Sign in with Google</button>
  </div>
</template>

<script setup lang="ts">
import { auth, db, provider } from '@/firebase'
import { signInWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const router = useRouter()

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    // Check if user exists in Firestore
    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        id: user.uid,
        name: user.displayName,
        photoURL: user.photoURL,
        spoons: [], // empty collection to start
      })
    }

    router.push('/map')
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
}

button {
  padding: 1rem;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
}
</style>
