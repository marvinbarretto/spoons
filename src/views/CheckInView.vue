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
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Pub } from '@/types/Pub'

const router = useRouter()
const { pubs } = usePubs()
const { currentUser } = useAuth()

const nearestPub = ref<(Pub & { distance: number }) | null>(null)
// TODO: Why not add distance to Pub type?

const userLocation = ref<{ lat: number; lng: number } | null>(null)
const distanceToPub = ref<number | null>(null)
const withinRange = ref(false)

const mapRef = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null

onMounted(() => {
  const checkLocation = async () => {
    // Wait until pub data is loaded
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

    navigator.geolocation.getCurrentPosition((pos) => {
      userLocation.value = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      }

      const nearest = pubs.value
        .map((pub) => ({
          ...pub,
          distance: getDistanceInMeters(
            pub.lat,
            pub.lng,
            userLocation.value!.lat,
            userLocation.value!.lng,
          ),
        }))
        .sort((a, b) => a.distance - b.distance)[0]

      nearestPub.value = nearest
      distanceToPub.value = Math.round(nearest.distance)
      withinRange.value = nearest.distance <= 100

      if (!withinRange.value && mapRef.value) {
        nextTick(() => renderMap(userLocation.value!, nearest))
      }
    })
  }

  checkLocation()
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

function renderMap(userPos: { lat: number; lng: number }, pub: Pub & { distance: number }) {
  if (!mapRef.value) return

  if (map) {
    map.remove()
  }

  map = L.map(mapRef.value)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map)

  const userMarker = L.marker([userPos.lat, userPos.lng]).addTo(map).bindPopup('You are here')
  const pubMarker = L.marker([pub.lat, pub.lng]).addTo(map).bindPopup(pub.name)

  userMarker.openPopup() // Show user popup immediately
  pubMarker.openPopup()

  // Add a 100m radius around the pub
  L.circle([pub.lat, pub.lng], { radius: 100, color: 'green', fillOpacity: 0.1 }).addTo(map)

  // Calculate bounds
  const bounds = L.latLngBounds([
    [userPos.lat, userPos.lng],
    [pub.lat, pub.lng],
  ])

  // Pad the bounds slightly for visual comfort
  map.fitBounds(bounds, { padding: [50, 50] })

  // Delay to ensure proper layout
  setTimeout(() => {
    map.invalidateSize()
  }, 200)
}

async function confirmCheckIn() {
  if (!currentUser.value || !nearestPub.value) return

  const pub = nearestPub.value
  const pubRef = doc(db, 'pubs', pub.id)
  const userRef = doc(db, 'users', currentUser.value.uid)

  await updateDoc(pubRef, {
    landlordId: currentUser.value.uid,
    landlordName: currentUser.value.displayName,
    lastClaimedAt: new Date().toISOString(),
  })

  await updateDoc(userRef, {
    spoons: arrayUnion(pub.id),
  })

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
