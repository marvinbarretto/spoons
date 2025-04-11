import { ref, onMounted } from 'vue'
import type { Pub } from '@/types/Pub'

const pubs = ref<Pub[]>([])

export function usePubs() {
  onMounted(async () => {
    if (!pubs.value.length) {
      const res = await fetch('/pubs.json')
      pubs.value = await res.json()
    }
  })

  return {
    pubs,
  }
}
