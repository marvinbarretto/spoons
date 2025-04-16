<template>
  <div>
    <h1>Create New Pub</h1>
    <PubForm :onSubmit="createPub" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { db } from '@/firebase'
import { doc, setDoc } from 'firebase/firestore'
import type { Pub } from '@/types/Pub'
import PubForm from '@/components/admin/PubForm.vue'

const router = useRouter()

async function createPub(data: Omit<Pub, 'id'>) {
  const id = `pub_${Date.now()}`
  const newPub: Pub = { id, ...data }
  await setDoc(doc(db, 'pubs', id), newPub)
  router.push('/admin/pubs')
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}
</style>
