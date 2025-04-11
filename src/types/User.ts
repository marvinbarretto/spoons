export interface UserProfile {
  id: string
  name: string
  photoURL?: string
  spoons: string[] // pub IDs
  badges?: string[] // badge IDs (optional at first)
}
