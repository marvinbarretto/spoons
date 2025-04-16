import { describe, it, expect } from 'vitest'
import { calculateNearestPub } from '@/composables/useCheckIn'
import type { Pub } from '@/types/Pub'

const dummyPubs: Pub[] = [
  {
    id: 'pub1',
    name: 'Pub One',
    location: { lat: 51.5, lng: -0.1, city: 'London', country: 'England' },
  },
  {
    id: 'pub2',
    name: 'Pub Two',
    location: { lat: 51.6, lng: -0.12, city: 'London', country: 'England' },
  },
  {
    id: 'pub3',
    name: 'Pub Three',
    location: { lat: 51.7, lng: -0.15, city: 'London', country: 'England' },
  },
]

describe('calculateNearestPub', () => {
  it('returns the closest pub', () => {
    const userLoc = { lat: 51.51, lng: -0.09 }
    const nearest = calculateNearestPub(dummyPubs, userLoc)

    expect(nearest.id).toBe('pub1')
    expect(nearest.distance).toBeGreaterThan(0)
  })

  it('adds a distance property to the pub', () => {
    const userLoc = { lat: 51.5, lng: -0.1 }
    const result = calculateNearestPub(dummyPubs, userLoc)

    expect(result).toHaveProperty('distance')
    expect(typeof result.distance).toBe('number')
  })
})
