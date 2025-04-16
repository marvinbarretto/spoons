import { ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import type { Pub } from '@/types/Pub'

const pubs = ref<Pub[]>([])
const loaded = ref(false)

/**
 * Load pubs (cached after first load).
 */
async function loadPubs() {
  if (!loaded.value) {
    console.log('📡 Fetching pubs from Firestore...')
    const snap = await getDocs(collection(db, 'pubs'))
    pubs.value = snap.docs.map((doc) => doc.data() as Pub)
    loaded.value = true
    console.log(`✅ Loaded ${pubs.value.length} pubs`)
  }
}

/**
 * Force refresh the pubs list from Firestore.
 */
async function refreshPubs() {
  console.log('🔁 Refreshing pubs from Firestore...')
  const snap = await getDocs(collection(db, 'pubs'))
  pubs.value = snap.docs.map((doc) => doc.data() as Pub)
  console.log(`✅ Refreshed ${pubs.value.length} pubs`)
}

export function usePubs() {
  return {
    pubs,
    loadPubs,
    refreshPubs,
  }
}
