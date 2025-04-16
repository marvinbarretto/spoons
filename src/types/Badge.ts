export type Badge = {
  id: string
  name: string
  description: string
  icon: string // path to icon or emoji
  group?: string
  region?: string
  tags?: string[]
}
