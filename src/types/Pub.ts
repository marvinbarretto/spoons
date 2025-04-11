export interface Pub {
  id: string
  name: string
  lat: number
  lng: number
  landlordId?: string
  landlordName?: string
  lastClaimedAt?: string
}
