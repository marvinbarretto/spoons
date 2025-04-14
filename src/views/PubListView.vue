<template>
  <div class="pub-list">
    <h1>All Pubs</h1>

    <ul v-if="pubs.length">
      <li v-for="pub in pubs" :key="pub.id">
        <RouterLink :to="`/pubs/${pub.id}`">
          <img :src="`/patterns/${pub.patternId}.png`" width="30" height="30" alt="" />
          {{ pub.name }}
        </RouterLink>
      </li>
    </ul>

    <p v-else>Loading pubs...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Pub } from '@/types/Pub'

const pubs = ref<Pub[]>([])

onMounted(async () => {
  const res = await fetch('/pubs.json')
  pubs.value = await res.json()
})
</script>

<style scoped>
.pub-list {
  padding: 1.5rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 0.5rem 0;
}

a {
  text-decoration: none;
  color: #3366cc;
}

a:hover {
  text-decoration: underline;
}
</style>
