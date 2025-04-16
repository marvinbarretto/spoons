<template>
  <div class="admin-pubs">
    <h1>Manage Pubs</h1>
    <router-link to="/admin/pubs/new">➕ New Pub</router-link>

    <ul>
      <li v-for="pub in pubs" :key="pub.id">
        {{ pub.name }}
        <router-link :to="`/admin/pubs/${pub.id}`">Edit</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import type { Pub } from '@/types/Pub'

const pubs = ref<Pub[]>([])

onMounted(async () => {
  const snap = await getDocs(collection(db, 'pubs'))
  pubs.value = snap.docs.map((doc) => doc.data() as Pub)
})
</script>
