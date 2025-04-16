import { doc, getDoc, updateDoc, collection, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { addSpoonToUser, addBadgesToUser } from '@/services/userService'
import { evaluateCheckInBadges } from '@/composables/useBadges'
import { CHECK_IN_DISTANCE_METRES } from '@/constants'
import { logAction } from '@/utils/logger'
import type { UserProfile } from '@/types/User'
import type { Pub } from '@/types/Pub'
import type { User } from 'firebase/auth'

// Optional: put in utils/geo.ts
type LatLng = { lat: number; lng: number }

function getDistanceInMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export function calculateNearestPub(pubs: Pub[], userLoc: LatLng): Pub & { distance: number } {
  const withDistances = pubs.map((pub) => ({
    ...pub,
    distance: getDistanceInMeters(pub.location.lat, pub.location.lng, userLoc.lat, userLoc.lng),
  }))

  return withDistances.sort((a, b) => a.distance - b.distance)[0]
}

function useCheckIn() {
  async function confirmCheckIn(
    user: User,
    profile: UserProfile,
    pub: Pub,
  ): Promise<{ redirect: string }> {
    logAction('🥄 Starting check-in process', { userId: user.uid, pubId: pub.id })

    await addSpoonToUser(user.uid, pub.id)
    logAction('✅ Spoon added', { pubId: pub.id })

    const checkInRef = doc(collection(db, 'pubs', pub.id, 'checkIns'))
    await setDoc(checkInRef, {
      userId: user.uid,
      timestamp: new Date().toISOString(),
    })

    const pubRef = doc(db, 'pubs', pub.id)
    const pubSnap = await getDoc(pubRef)

    if (pubSnap.exists() && !pubSnap.data().landlordId) {
      await updateDoc(pubRef, {
        landlordId: user.uid,
        landlordName: user.displayName,
        lastClaimedAt: new Date().toISOString(),
      })
      logAction('👑 Landlord assigned')
    }

    const badges = evaluateCheckInBadges(profile, pub)
    if (badges.length) {
      await addBadgesToUser(user.uid, badges)
      logAction('🏆 Badges awarded', badges)
      return {
        redirect: `/badge-award?ids=${badges.join(',')}&returnTo=/me`,
      }
    }

    logAction('↪️ Redirect to /me')
    return { redirect: '/me' }
  }

  return {
    confirmCheckIn,
    calculateNearestPub,
    CHECK_IN_DISTANCE_METRES,
  }
}

export { useCheckIn }
