<template>
  <header class="app-header">
    <RouterLink to="/" class="logo">🍻 Spoons</RouterLink>

    <nav>
      <RouterLink to="/check-in">Check In</RouterLink>
      <RouterLink to="/map">Map</RouterLink>
      <RouterLink to="/pubs">Pubs</RouterLink>
      <RouterLink to="/admin/pubs" v-if="userProfile && userProfile?.isAdmin">Admin</RouterLink>
    </nav>

    <nav>
      <template v-if="currentUser">
        <img :src="currentUser.photoURL || ''" class="user-photo" />
        <button @click="logout">Logout</button>
      </template>
      <template v-else>
        <button @click="login">Login</button>
      </template>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, db, provider } from '@/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useAuth } from '@/composables/useAuth'
import router from '@/router'

const { currentUser, userProfile } = useAuth()

const login = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    const userRef = doc(db, 'users', user.uid)
    const snap = await getDoc(userRef)

    if (!snap.exists()) {
      await setDoc(userRef, {
        id: user.uid,
        name: user.displayName,
        photoURL: user.photoURL,
        spoons: [],
      })
    }

    // 🔁 Redirect to profile
    router.push('/')
  } catch (err) {
    console.error('Login failed:', err)
  }
}

const logout = async () => {
  try {
    await signOut(auth)
  } catch (err) {
    console.error('Logout failed:', err)
  }
}
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f7f7f7;
  border-bottom: 1px solid #ddd;
}

nav {
  display: flex;
  align-items: center;
}

.user-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.user-name {
  margin-right: 1rem;
}
</style>
