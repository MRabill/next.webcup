"use client"

import { Heart, Frown, Smile, Angry, ThumbsUp, Zap } from "lucide-react"
import FloatingEmotionCard from "@/components/floating-emotion-card"
import type { EmotionType } from "@/lib/types"

export default function FloatingEmotionCards() {
  const emotions: EmotionType[] = [
    {
      type: "love",
      icon: Heart,
      color: "bg-red-500",
      position: { top: "10%", left: "15%" },
    },
    {
      type: "sad",
      icon: Frown,
      color: "bg-blue-500",
      position: { top: "25%", left: "75%" },
    },
    {
      type: "happy",
      icon: Smile,
      color: "bg-yellow-500",
      position: { top: "65%", left: "20%" },
    },
    {
      type: "angry",
      icon: Angry,
      color: "bg-orange-500",
      position: { top: "40%", left: "85%" },
    },
    {
      type: "proud",
      icon: ThumbsUp,
      color: "bg-green-500",
      position: { top: "80%", left: "60%" },
    },
    {
      type: "electric",
      icon: Zap,
      color: "bg-purple-500",
      position: { top: "15%", left: "45%" },
    },
  ]

  return (
    <>
      {emotions.map((emotion, index) => (
        <FloatingEmotionCard key={index} emotion={emotion} />
      ))}
    </>
  )
}
