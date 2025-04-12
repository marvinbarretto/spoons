<template>
  <div class="map-container">
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { db } from '@/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useAuth } from '@/composables/useAuth'

// Dummy fallback location
const defaultCoords = { lat: 51.509865, lng: -0.118092 } // London

const mapContainer = ref<HTMLDivElement | null>(null)

// Haversine formula
function getDistanceInMetres(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371e3 // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // in meters
}

onMounted(async () => {
  const pubsRes = await fetch('/pubs.json')
  const pubs = await pubsRes.json()

  // Use browser geolocation to center map
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      initMap({ lat: latitude, lng: longitude }, pubs)
    },
    () => {
      initMap(defaultCoords, pubs)
    },
  )
})

function initMap(center: { lat: number; lng: number }, pubs: any[]) {
  if (!mapContainer.value) return

  const map = L.map(mapContainer.value).setView([center.lat, center.lng], 14)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map)

  pubs.forEach((pub) => {
    const marker = L.marker([pub.lat, pub.lng]).addTo(map)
    marker.bindPopup(`<strong>${pub.name}</strong>`)
  })
}
</script>

<style scoped>
.map-container {
  height: 100vh;
  width: 100%;
}

#map {
  height: 100%;
  width: 100%;
}
</style>
