<template>
  <div class="pub-detail">
    <div class="pub-detail__title">
      <img
        v-if="pub?.patternId"
        :src="`/patterns/${pub.patternId}.png`"
        alt="Carpet pattern"
        class="pattern-img"
      />
      <h1>{{ pub?.name }}</h1>
    </div>

    <div class="map" ref="mapRef" />

    <div class="landlord" v-if="pub?.landlordId">
      <p>Landlord: {{ pub.landlordName }}</p>
      <img :src="landlord?.photoURL" :alt="landlord?.name" class="avatar" />
    </div>

    <div class="stats">
      <p>Total check-ins: {{ checkInCount }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '@/firebase'
import { doc, getDoc, collection, getCountFromServer } from 'firebase/firestore'
import type { Pub } from '@/types/Pub'
import type { UserProfile } from '@/types/User'
import { useLeafletMap } from '@/composables/useLeafletMap'

const route = useRoute()
const pubId = route.params.id as string

const pub = ref<Pub | null>(null)
const landlord = ref<UserProfile | null>(null)
const checkInCount = ref<number>(0)
const mapRef = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  // Load pubs from static file
  const res = await fetch('/pubs.json')
  const pubs = await res.json()
  pub.value = pubs.find((p: Pub) => p.id === pubId) ?? null

  // Optional: Get landlord info (dynamic)
  if (pub.value?.landlordId) {
    const landlordSnap = await getDoc(doc(db, 'users', pub.value.landlordId))
    if (landlordSnap.exists()) {
      landlord.value = landlordSnap.data() as UserProfile
    }
  }

  // Optional: Get check-in count
  const countSnap = await getCountFromServer(collection(db, 'pubs', pubId, 'checkIns'))
  checkInCount.value = countSnap.data().count

  // Render map
  if (pub.value && mapRef.value) {
    const { addMarker, setView } = useLeafletMap(mapRef.value)
    setView(pub.value.lat, pub.value.lng, 17)
    addMarker(pub.value.lat, pub.value.lng, pub.value.name)
  }
})
</script>

<style scoped>
.pub-detail {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pub-detail__title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.map {
  height: 250px;
  width: 100%;
  margin-bottom: 1rem;
}
.pattern-img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 5px solid #ccc;
  border-radius: 999px;
}
.landlord {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 999px;
  object-fit: cover;
}
</style>
