import type { LucideIcon } from "lucide-react"

export interface EmotionType {
  type: string
  icon: LucideIcon
  color: string
  position: {
    top: string
    left: string
  }
}

export interface EmotionTone {
  id: string
  name: string
  description: string
  color: string
  prompt: string
}

export interface GeneratedContent {
  title: string
  content: string
}
