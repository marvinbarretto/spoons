// composables/usePostcodeLookup.ts
import { ref } from 'vue'

type PostcodeLocation = {
  lat: number
  lng: number
  city: string
  country: string
}

export function usePostcodeLookup() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function lookupPostcode(postcode: string): Promise<PostcodeLocation | null> {
    isLoading.value = true
    error.value = null
    console.log('🔍 Looking up postcode:', postcode)

    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${postcode}`)
      const data = await res.json()
      console.log('📦 API response:', data)

      if (data.status === 200 && data.result) {
        const loc: PostcodeLocation = {
          lat: data.result.latitude,
          lng: data.result.longitude,
          city: data.result.admin_district,
          country: data.result.country,
        }
        console.log('✅ Parsed location:', loc)
        return loc
      } else {
        error.value = `Postcode not found (${postcode})`
        console.warn('⚠️ Invalid postcode:', postcode)
        return null
      }
    } catch (err: unknown) {
      error.value = 'Failed to fetch postcode data.'
      console.error('❌ Lookup failed:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    lookupPostcode,
  }
}
