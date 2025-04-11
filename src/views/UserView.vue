<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { usePubs } from '@/composables/usePubs'

const { userProfile } = useAuth()
const { pubs } = usePubs()

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
</script>

<template>
  <div v-if="userProfile" class="user-view">
    <div class="profile">
      <img :src="userProfile.photoURL" class="avatar" />
      <h2>{{ userProfile.name }}</h2>
      <p>You’ve collected {{ userProfile.spoons.length }} 🍴 spoons</p>
    </div>

    <div class="badges">
      <h3>Your Spoons</h3>
      <div class="badge-grid">
        <div v-for="spoon in userProfile.spoons" :key="spoon" class="badge">
          <span>🍴</span>
          <p>{{ getPubName(spoon) }}</p>
        </div>
      </div>

      <h3>Badges</h3>
      <div class="badge-grid">
        <div v-for="badge in userProfile.badges || []" :key="badge" class="badge">
          <span>{{ getBadgeIcon(badge) }}</span>
          <p>{{ getBadgeName(badge) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
