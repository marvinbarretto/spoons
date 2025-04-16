<template>
  <div class="map-container">
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useLeafletMap } from '@/composables/useLeafletMap'
import type { Pub } from '@/types/Pub'
import { MAP_DEFAULT_CENTER } from '@/constants'

// Dummy fallback location
const defaultCoords = MAP_DEFAULT_CENTER

const mapContainer = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  const pubsRes = await fetch('/pubs.json')
  const pubs: Pub[] = await pubsRes.json()

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords
      await nextTick()
      renderMap({ lat: latitude, lng: longitude }, pubs)
    },
    async () => {
      await nextTick()
      renderMap(defaultCoords, pubs)
    },
  )
})

function renderMap(center: { lat: number; lng: number }, pubs: Pub[]) {
  if (!mapContainer.value) return

  const { addMarker, setView } = useLeafletMap(mapContainer.value)

  setView(center.lat, center.lng, 14)

  pubs.forEach((pub) => {
    addMarker(pub.location.lat, pub.location.lng, `<strong>${pub.name}</strong>`)
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
