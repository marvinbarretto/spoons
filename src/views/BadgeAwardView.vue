<template>
  <div class="award-screen">
    <h2>🎉 Congratulations!</h2>

    <div class="badge-list">
      <div v-for="badge in awardedBadges" :key="badge.id" class="badge">
        <img :src="badge.icon" :alt="badge.name" />
        <h3>{{ badge.name }}</h3>
        <p>{{ badge.description }}</p>
      </div>
    </div>

    <button @click="router.push(returnTo)">Continue</button>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { BADGES } from '@/badges' // TODO: Address the folder structure

const route = useRoute()
const router = useRouter()

const badgeIds = (route.query.ids as string).split(',')
const returnTo = (route.query.returnTo as string) || '/me'

const awardedBadges = BADGES.filter((b) => badgeIds.includes(b.id))
</script>

<style scoped>
.award-screen {
  text-align: center;
  padding: 2rem;
  animation: fadeInUp 0.8s ease-out;
}

.badge-list {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin: 2rem 0;
}

.badge img {
  width: 60px;
  height: 60px;
}

button {
  font-size: 1.1rem;
  padding: 1rem 2rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 12px;
}
</style>
