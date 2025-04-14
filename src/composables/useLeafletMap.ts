// src/composables/useLeafletMap.ts
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export function useLeafletMap(mapContainer: HTMLElement | null) {
  if (!mapContainer) throw new Error('Map container is null')

  // Remove existing map instance if needed
  const map = L.map(mapContainer)

  const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map)

  function addMarker(lat: number, lng: number, popupText?: string) {
    const marker = L.marker([lat, lng]).addTo(map)
    if (popupText) marker.bindPopup(popupText)
    return marker
  }

  function addCircle(lat: number, lng: number, radius = 100, color = 'green') {
    return L.circle([lat, lng], {
      radius,
      color,
      fillOpacity: 0.1,
    }).addTo(map)
  }

  function fitToPoints(points: [number, number][], padding: number = 50) {
    const bounds = L.latLngBounds(points)
    map.fitBounds(bounds, { padding: [padding, padding] })
  }

  function setView(lat: number, lng: number, zoom: number = 14) {
    map.setView([lat, lng], zoom)
  }

  function cleanup() {
    map.remove()
  }

  // Delay for container resize if needed
  setTimeout(() => map.invalidateSize(), 200)

  return {
    map,
    addMarker,
    addCircle,
    fitToPoints,
    setView,
    cleanup,
  }
}
