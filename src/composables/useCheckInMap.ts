import type { Ref } from 'vue'
import { useLeafletMap } from './useLeafletMap'
import type { Pub } from '@/types/Pub'

export function useCheckInMap(mapRef: Ref<HTMLElement | null>) {
  const renderCheckInMap = async (userPos: { lat: number; lng: number }, pub: Pub) => {
    const { addMarker, addCircle, fitToPoints } = useLeafletMap(mapRef.value)
    addMarker(userPos.lat, userPos.lng, 'You are here')
    addMarker(pub.lat, pub.lng, pub.name)
    addCircle(pub.lat, pub.lng, 100)
    fitToPoints([
      [userPos.lat, userPos.lng],
      [pub.lat, pub.lng],
    ])
  }

  return { renderCheckInMap }
}
