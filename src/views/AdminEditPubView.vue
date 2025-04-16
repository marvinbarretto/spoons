<template>
  <div v-if="pub">
    <h1>Edit Pub</h1>
    <PubForm :initialPub="pub" :onSubmit="updatePub" />
    <button @click="deletePub" class="danger">Delete Pub</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db } from '@/firebase'
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import type { Pub } from '@/types/Pub'
import PubForm from '@/components/admin/PubForm.vue'

const route = useRoute()
const router = useRouter()
const pub = ref<Pub | null>(null)

onMounted(async () => {
  const id = route.params.id as string
  const snap = await getDoc(doc(db, 'pubs', id))
  if (snap.exists()) {
    pub.value = snap.data() as Pub
  }
})

async function updatePub(data: Omit<Pub, 'id'>) {
  const id = route.params.id as string
  await updateDoc(doc(db, 'pubs', id), data)
  router.push('/admin/pubs')
}

async function deletePub() {
  const id = route.params.id as string
  const confirmed = confirm(`Are you sure you want to delete pub: ${pub.value?.name}?`)
  if (!confirmed) return

  await deleteDoc(doc(db, 'pubs', id))
  alert('Pub deleted.')
  router.push('/admin/pubs')
}
</script>
<style scoped>
.danger {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  padding: 0.5rem 1rem;
}
</style>
