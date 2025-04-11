<template>
  <div class="login-view">
    <h1>Welcome to Spoons 🍺</h1>
    <button @click="signInWithGoogle">Sign in with Google</button>
  </div>
</template>

<script setup lang="ts">
import { auth, provider } from '@/firebase'
import { signInWithPopup } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    console.log('Logged in as:', result.user.displayName)
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
