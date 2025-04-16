<template>
  <div class="map-container">
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useLeafletMap } from '@/composables/useLeafletMap'
import { usePubs } from '@/composables/usePubs'
import { MAP_DEFAULT_CENTER } from '@/constants'

const mapContainer = ref<HTMLDivElement | null>(null)
const defaultCoords = MAP_DEFAULT_CENTER

const { pubs, loadPubs } = usePubs()

onMounted(async () => {
  await loadPubs() // ✅ ensure pubs are loaded from Firestore

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords
      await nextTick()
      renderMap({ lat: latitude, lng: longitude })
    },
    async () => {
      await nextTick()
      renderMap(defaultCoords)
    },
  )
})

function renderMap(center: { lat: number; lng: number }) {
  if (!mapContainer.value) return

  const { addMarker, setView } = useLeafletMap(mapContainer.value)

  setView(center.lat, center.lng, 5)

  pubs.value.forEach((pub) => {
    const { location } = pub
    if (!location || location.lat == null || location.lng == null) {
      console.warn(`⚠️ Skipping pub with invalid location: ${pub.name}`)
      return
    }

    addMarker(location.lat, location.lng, `<strong>${pub.name}</strong>`)
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
