export interface Pub {
  id: string
  name: string
  lat: number
  lng: number
  landlordId?: string // null if unclaimed
  landlordName?: string
  lastClaimedAt?: string
}
