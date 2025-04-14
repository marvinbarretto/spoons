<template>
  <div class="checkin-view">
    <h2>Checking your location...</h2>

    <div v-if="nearestPub && withinRange">
      <p>
        Are you at <strong>{{ nearestPub.name }}</strong
        >?
      </p>
      <button @click="confirmCheckIn">Yes, check me in!</button>
    </div>

    <div v-else-if="nearestPub && !withinRange">
      <p>
        You’re near <strong>{{ nearestPub.name }}</strong
        >, but not close enough ({{ distanceToPub }}m).
      </p>
    </div>

    <div v-else>
      <p>No nearby pub found. Try again later.</p>
    </div>

    <!-- Always render the map container -->
    <div
      id="map"
      ref="mapRef"
      :style="{ visibility: nearestPub && !withinRange ? 'visible' : 'hidden' }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { usePubs } from '@/composables/usePubs'
import { useAuth } from '@/composables/useAuth'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '@/firebase'
import type { Pub } from '@/types/Pub'
import { useLeafletMap } from '@/composables/useLeafletMap'
import { CHECK_IN_DISTANCE_METRES } from '@/constants'
import { addSpoonToUser } from '@/services/userService'

const router = useRouter()
const { pubs } = usePubs()
const { currentUser } = useAuth()

const nearestPub = ref<(Pub & { distance: number }) | null>(null)

const userLocation = ref<{ lat: number; lng: number } | null>(null)
const distanceToPub = ref<number | null>(null)
const withinRange = ref(false)

const mapRef = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  const waitForPubs = () =>
    new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (pubs.value.length > 0) {
          clearInterval(interval)
          resolve()
        }
      }, 100)
    })

  await waitForPubs()

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const userPos = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    }

    userLocation.value = userPos

    const nearest = pubs.value
      .map((pub) => ({
        ...pub,
        distance: getDistanceInMeters(pub.lat, pub.lng, userPos.lat, userPos.lng),
      }))
      .sort((a, b) => a.distance - b.distance)[0]

    nearestPub.value = nearest
    distanceToPub.value = Math.round(nearest.distance)
    withinRange.value = nearest.distance <= CHECK_IN_DISTANCE_METRES

    if (!withinRange.value && mapRef.value) {
      await nextTick()

      const { addMarker, addCircle, fitToPoints } = useLeafletMap(mapRef.value)

      addMarker(userPos.lat, userPos.lng, 'You are here')
      addMarker(nearest.lat, nearest.lng, nearest.name)
      addCircle(nearest.lat, nearest.lng, 100)
      fitToPoints([
        [userPos.lat, userPos.lng],
        [nearest.lat, nearest.lng],
      ])
    }
  })
})

function getDistanceInMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

async function confirmCheckIn() {
  if (!currentUser.value || !nearestPub.value) return

  const pub = nearestPub.value
  const pubRef = doc(db, 'pubs', pub.id)

  await updateDoc(pubRef, {
    landlordId: currentUser.value.uid,
    landlordName: currentUser.value.displayName,
    lastClaimedAt: new Date().toISOString(),
  })

  await addSpoonToUser(currentUser.value.uid, pub.id)

  router.push('/me')
}
</script>

<style scoped>
.checkin-view {
  padding: 1.5rem;
  text-align: center;
}
#map {
  height: 300px;
  width: 100%;
  margin-top: 1rem;
  border-radius: 8px;
}
button {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #4caf50;
  color: white;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
}

#map {
  border: 2px dashed red;
}
</style>

<!--
<img
  :src="`/patterns/${pub.patternId}.svg`"
  :alt="`Pattern for ${pub.name}`"
  width="50"
  height="50"
/> -->
