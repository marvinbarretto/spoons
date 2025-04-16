import { ref, computed } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import localforage from 'localforage'
import type { Pub } from '@/types/Pub'

// Reactive list of pubs and a loading state
const pubs = ref<Pub[]>([])
const loaded = ref(false)

// Cache key for localForage
const CACHE_KEY = 'cached_pubs'

// Total count (computed)
export const totalPubs = computed(() => pubs.value.length)

/**
 * Load pubs from local cache or Firestore (if not loaded yet)
 */
export async function loadPubs() {
  if (loaded.value) {
    console.log('✅ Already loaded pubs from cache or DB')
    return
  }

  console.log('📦 Attempting to load pubs from localForage...')
  const cached = await localforage.getItem<Pub[]>(CACHE_KEY)

  if (cached && cached.length > 0) {
    pubs.value = cached
    loaded.value = true
    console.log(`✅ Loaded ${cached.length} pubs from cache`)
    return
  }

  console.log('📡 No cache found — fetching pubs from Firestore...')
  const snap = await getDocs(collection(db, 'pubs'))
  const fetched = snap.docs.map((doc) => doc.data() as Pub)
  pubs.value = fetched
  loaded.value = true

  // Save to localForage
  await localforage.setItem(CACHE_KEY, fetched)
  console.log(`✅ Loaded ${fetched.length} pubs from Firestore and cached locally`)
}

/**
 * Force refresh from Firestore and update local cache
 */
export async function refreshPubs() {
  console.log('🔁 Force refreshing pubs from Firestore...')
  const snap = await getDocs(collection(db, 'pubs'))
  const refreshed = snap.docs.map((doc) => doc.data() as Pub)
  pubs.value = refreshed
  loaded.value = true

  await localforage.setItem(CACHE_KEY, refreshed)
  console.log(`✅ Refreshed and cached ${refreshed.length} pubs`)
}

/**
 * Clear the local cache manually (optional debug utility)
 */
export async function clearPubsCache() {
  await localforage.removeItem(CACHE_KEY)
  loaded.value = false
  pubs.value = []
  console.log('🧹 Cleared local pubs cache')
}

export function usePubs() {
  return {
    pubs,
    loadPubs,
    refreshPubs,
    clearPubsCache,
    totalPubs,
  }
}
