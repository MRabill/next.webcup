"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { EmotionTone } from "@/lib/types"
import { Angry, Frown, Laugh, Heart, ThumbsUp, Zap } from "lucide-react"

interface TonePreviewProps {
  selectedTone: string | null
  tones: EmotionTone[]
}

export default function TonePreview({ selectedTone, tones }: TonePreviewProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; color: string }[]>([])

  const selectedToneObj = tones.find((tone) => tone.id === selectedTone)

  useEffect(() => {
    if (!selectedTone) return

    // Clear existing particles
    setParticles([])

    // Create new particles based on the selected tone
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 5,
      color: selectedToneObj?.color || "bg-gray-500",
    }))

    setParticles(newParticles)
  }, [selectedTone, selectedToneObj])

  const getAnimationForTone = (toneId: string | null) => {
    switch (toneId) {
      case "angry":
        return {
          initial: { scale: 0.8, rotate: -5 },
          animate: { scale: [0.8, 1.1, 0.9, 1], rotate: [-5, 5, -3, 0] },
          transition: { duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
        }
      case "sad":
        return {
          initial: { y: 0 },
          animate: { y: [0, -10, 0] },
          transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }
      case "happy":
        return {
          initial: { rotate: 0 },
          animate: { rotate: [0, 5, -5, 0] },
          transition: { duration: 1, repeat: Number.POSITIVE_INFINITY },
        }
      case "sarcastic":
        return {
          initial: { opacity: 0.7 },
          animate: { opacity: [0.7, 1, 0.7] },
          transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
        }
      case "grateful":
        return {
          initial: { scale: 1 },
          animate: { scale: [1, 1.05, 1] },
          transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
        }
      case "dramatic":
        return {
          initial: { scale: 1, rotate: 0 },
          animate: { scale: [1, 1.2, 0.9, 1.1, 1], rotate: [0, 10, -10, 5, 0] },
          transition: { duration: 3, repeat: Number.POSITIVE_INFINITY },
        }
      default:
        return {
          initial: { scale: 1 },
          animate: { scale: 1 },
          transition: { duration: 1 },
        }
    }
  }

  const getIconForTone = (toneId: string | null) => {
    switch (toneId) {
      case "angry":
        return Angry
      case "sad":
        return Frown
      case "happy":
        return Laugh
      case "sarcastic":
        return Zap
      case "grateful":
        return ThumbsUp
      case "dramatic":
        return Heart
      default:
        return null
    }
  }

  const IconComponent = selectedTone ? getIconForTone(selectedTone) : null
  const animation = getAnimationForTone(selectedTone)

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-none text-white h-full relative overflow-hidden">
      <CardHeader>
        <CardTitle>Preview Your Tone</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-[400px] relative">
        {!selectedTone ? (
          <div className="text-center text-gray-400">
            <p>Select a tone to see a preview</p>
          </div>
        ) : (
          <>
            {/* Background particles */}
            <AnimatePresence>
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className={`absolute rounded-full ${particle.color.replace("bg-", "bg-opacity-20 bg-")}`}
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scale: [0.5, 1, 0.5],
                    x: [0, Math.random() * 40 - 20, 0],
                    y: [0, Math.random() * 40 - 20, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </AnimatePresence>

            {/* Central icon */}
            {IconComponent && (
              <motion.div
                className={`${selectedToneObj?.color} p-8 rounded-full`}
                initial={animation.initial}
                animate={animation.animate}
                transition={animation.transition}
              >
                <IconComponent size={64} />
              </motion.div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
