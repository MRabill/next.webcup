"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ConfettiEffect from "./transitions/confetti-effect"
import RainEffect from "./transitions/rain-effect"
import HeartEffect from "./transitions/heart-effect"
import ShatterEffect from "./transitions/shatter-effect"
import GlitchEffect from "./transitions/glitch-effect"
import ZenEffect from "./transitions/zen-effect"

interface MoodTransitionProps {
  mood: string
  previousMood?: string
  isActive: boolean
  onComplete?: () => void
}

export default function MoodTransition({ mood, previousMood, isActive, onComplete }: MoodTransitionProps) {
  const [showEffect, setShowEffect] = useState(false)
  const [currentEffect, setCurrentEffect] = useState<string | null>(null)

  useEffect(() => {
    if (isActive && mood && mood !== previousMood) {
      setCurrentEffect(mood)
      setShowEffect(true)

      // Hide effect after animation completes
      const timer = setTimeout(() => {
        setShowEffect(false)
        if (onComplete) onComplete()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [mood, previousMood, isActive, onComplete])

  if (!showEffect || !currentEffect) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {currentEffect === "funny" && <ConfettiEffect />}
        {currentEffect === "sad" && <RainEffect />}
        {currentEffect === "heartfelt" && <HeartEffect />}
        {currentEffect === "rage" && <ShatterEffect />}
        {currentEffect === "robotic" && <GlitchEffect />}
        {currentEffect === "calm" && <ZenEffect />}
      </motion.div>
    </AnimatePresence>
  )
}
