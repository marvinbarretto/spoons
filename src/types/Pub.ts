export type Pub = {
  id: string
  name: string
  location: {
    city: string
    country: string
    lat: number
    lng: number
  }
  landlordId?: string
  lastClaimedAt?: string
  numberOfCheckIns?: number
}
