<template>
  <div class="checkin-view">
    <h2>Checking your location...</h2>

    <div v-if="nearestPub && withinRange">
      <p>
        Are you at <strong>{{ nearestPub.name }}</strong
        >?
      </p>
      <button @click="handleConfirmCheckIn">Yes, check me in!</button>
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
import { useCheckIn } from '@/composables/useCheckIn'
import { useCheckInMap } from '@/composables/useCheckInMap'
import { useAuth } from '@/composables/useAuth'
import { usePubs } from '@/composables/usePubs'
import { logAction } from '@/utils/logger'
import { ref, onMounted, nextTick } from 'vue'
import router from '../router'
import type { Pub } from '../types/Pub'

const { currentUser, userProfile } = useAuth()
const { pubs } = usePubs()

const mapRef = ref<HTMLDivElement | null>(null)
const nearestPub = ref<(Pub & { distance: number }) | null>(null)
const withinRange = ref(false)
const distanceToPub = ref<number | null>(null)
const userLocation = ref<{ lat: number; lng: number } | null>(null)

const { calculateNearestPub, CHECK_IN_DISTANCE_METRES } = useCheckIn()
const { renderCheckInMap } = useCheckInMap(mapRef)
const { confirmCheckIn } = useCheckIn()

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
    const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude }
    userLocation.value = userPos

    const nearest = calculateNearestPub(pubs.value, userPos)
    nearestPub.value = nearest
    distanceToPub.value = Math.round(nearest.distance)
    withinRange.value = nearest.distance <= CHECK_IN_DISTANCE_METRES

    logAction('🧭 Located user and found nearest pub', {
      location: userPos,
      nearestPub: nearest.name,
      distance: nearest.distance,
    })

    if (!withinRange.value) {
      await nextTick()
      renderCheckInMap(userPos, nearest)
    }
  })
})

async function handleConfirmCheckIn() {
  if (!currentUser.value || !userProfile.value || !nearestPub.value) return

  const result = await confirmCheckIn(currentUser.value, userProfile.value, nearestPub.value)
  if (result.redirect) router.push(result.redirect)
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
