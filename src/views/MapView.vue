<template>
  <div class="map-container">
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Dummy fallback location
const defaultCoords = { lat: 51.509865, lng: -0.118092 } // London

const mapContainer = ref<HTMLDivElement | null>(null)

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
