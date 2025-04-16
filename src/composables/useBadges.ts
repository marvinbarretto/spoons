import type { UserProfile } from '@/types/User'
import type { Pub } from '@/types/Pub'

export function evaluateCheckInBadges(user: UserProfile, pub: Pub): string[] {
  const earned: string[] = []

  if ((user.spoons?.length ?? 0) === 0) {
    earned.push('first-checkin')
  }

  const now = new Date()
  if (now.getHours() < 12) {
    earned.push('early-riser')
  }

  const alreadyEarned = user.badges ?? []

  return earned.filter((b) => !alreadyEarned.includes(b))
}

// TODO: Add more badge logic
