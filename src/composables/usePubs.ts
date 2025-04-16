// composables/usePubs.ts
import { ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import type { Pub } from '@/types/Pub'

// ✅ pub list is cached in memory per session
const pubs = ref<Pub[]>([])
const loaded = ref(false)

/**
 * Loads pubs from Firestore (only once per session).
 * Can be called in any component that needs pub data.
 */
export function usePubs() {
  async function loadPubs() {
    if (!loaded.value) {
      console.log('📡 Fetching pubs from Firestore...')
      const snap = await getDocs(collection(db, 'pubs'))

      if (snap.empty) {
        console.warn('⚠️ pubs collection is empty or missing')
      }

      pubs.value = snap.docs.map((doc) => doc.data() as Pub)
      loaded.value = true
      console.log(`✅ Loaded ${pubs.value.length} pubs`)
    } else {
      console.log('✅ Using cached pubs')
    }
  }

  return { pubs, loadPubs }
}
