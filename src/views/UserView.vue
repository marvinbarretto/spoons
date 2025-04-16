<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { usePubs } from '@/composables/usePubs'
import { doc, updateDoc, arrayRemove } from 'firebase/firestore'
import { db } from '@/firebase'

const { userProfile, currentUser } = useAuth()
const { pubs } = usePubs()

async function removeSpoon(spoonId: string | undefined) {
  console.log('🗑 Attempting to remove spoon:', spoonId)

  if (!currentUser.value || !spoonId) {
    console.warn('⚠️ Missing current user or spoon ID')
    return
  }

  const ref = doc(db, 'users', currentUser.value.uid)
  await updateDoc(ref, {
    spoons: arrayRemove(spoonId),
  })

  console.log('✅ Spoon removed')
}

async function removeBadge(badgeId: string | undefined) {
  console.log('🗑 Attempting to remove badge:', badgeId)

  if (!currentUser.value || !badgeId) {
    console.warn('⚠️ Missing current user or badge ID')
    return
  }

  const ref = doc(db, 'users', currentUser.value.uid)
  await updateDoc(ref, {
    badges: arrayRemove(badgeId),
  })

  console.log('✅ Badge removed')
}

const getPubName = (pubId: string) => pubs.value.find((p) => p.id === pubId)?.name || pubId
const getBadgeIcon = (id: string) => {
  const icons: Record<string, string> = {
    'early-bird': '🌅',
    'hat-trick': '🥉',
  }
  return icons[id] || '🏅'
}
const getBadgeName = (id: string) => {
  const names: Record<string, string> = {
    'early-bird': 'Early Bird',
    'hat-trick': '3 in a Day',
  }
  return names[id] || id
}

const isDev = import.meta.env.DEV

function getPatternImage(pubId: string): string {
  const match = pubs.value.find((p) => p.id === pubId)
  return match?.patternId ? `/patterns/${match.patternId}.png` : '/patterns/default.png'
}
</script>

<template>
  <div v-if="userProfile" class="user-view">
    <div class="profile">
      <h2>{{ userProfile.name }}</h2>
      <img :src="userProfile.photoURL" class="avatar" />
    </div>

    <section class="counts">
      <!-- TODO: Replace 100 with max spoons -->
      <p>You have collected {{ userProfile.spoons.length }} spoons out of 100</p>
      <!-- Show in a progress bar -->
      <div class="progress-bar">
        <div
          class="progress"
          :style="{ width: `${(userProfile.spoons.length / 100) * 100}%` }"
        ></div>
      </div>
    </section>

    <section class="spoons">
      <h3>Your Spoons</h3>
      <p>You’ve collected {{ userProfile.spoons.length }} 🍴 spoons</p>
      <div class="badge-grid">
        <div v-for="spoon in userProfile.spoons" :key="spoon" class="badge">
          <img :src="getPatternImage(spoon)" alt="Pattern badge" class="badge-img" />
          <p>{{ getPubName(spoon) }}</p>
          <button v-if="isDev" @click="removeSpoon(spoon)" class="dev-button">🗑 Remove</button>
        </div>
      </div>
    </section>

    <section class="badges">
      <h3>Badges</h3>
      <p v-if="userProfile.badges?.length">You have {{ userProfile.badges.length }} badges</p>
      <p v-else>No badges yet</p>
      <div class="badge-grid">
        <div v-for="badge in userProfile.badges || []" :key="badge" class="badge">
          <span>{{ getBadgeIcon(badge) }}</span>
          <p>{{ getBadgeName(badge) }}</p>
          <p>{{ badge }}</p>
          <button v-if="isDev" @click="removeBadge(badge)" class="dev-button">🗑 Remove</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.user-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 1rem;
}

.profile {
  background-color: rgba(255, 0, 0, 0.1);
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

section {
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.badge-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.badge-img {
  width: 60px;
  height: 60px;
  display: block;
  border-radius: 50%;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
}
</style>
