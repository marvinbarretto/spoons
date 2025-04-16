<template>
  <div class="pub-list-with-map">
    <h1>All Pubs</h1>

    <div class="map-container" ref="mapContainer"></div>

    <ul v-if="pubs.length" class="pub-list">
      <li v-for="pub in pubs" :key="pub.id">
        <RouterLink :to="`/pubs/${pub.id}`">
          {{ pub.name }}
        </RouterLink>
      </li>
    </ul>

    <p v-else>Loading pubs...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { usePubs } from '@/composables/usePubs'
import { useLeafletMap } from '@/composables/useLeafletMap'
import { MAP_DEFAULT_CENTER } from '@/constants'

const mapContainer = ref<HTMLDivElement | null>(null)

const { pubs, loadPubs } = usePubs()

onMounted(async () => {
  await loadPubs()
  await nextTick()

  const { addMarker, setView } = useLeafletMap(mapContainer.value!)

  const first = pubs.value[0]
  const center = first?.location ?? MAP_DEFAULT_CENTER

  setView(center.lat, center.lng, 6)

  pubs.value.forEach((pub) => {
    const { lat, lng } = pub.location
    addMarker(lat, lng, `<strong>${pub.name}</strong><br>${pub.location.city}`)
  })
})
</script>

<style scoped>
.pub-list-with-map {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.map-container {
  height: 300px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.pub-list {
  list-style: none;
  padding: 0;
}
</style>
