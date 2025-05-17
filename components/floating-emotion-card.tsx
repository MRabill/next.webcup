"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { EmotionType } from "@/lib/types"

interface FloatingEmotionCardProps {
  emotion: EmotionType
}

export default function FloatingEmotionCard({ emotion }: FloatingEmotionCardProps) {
  const [position, setPosition] = useState({
    x: Math.random() * 20 - 10,
    y: Math.random() * 20 - 10,
  })

  // Create a floating effect by randomly changing position
  useEffect(() => {
    const interval = setInterval(
      () => {
        setPosition({
          x: Math.random() * 40 - 20,
          y: Math.random() * 40 - 20,
        })
      },
      3000 + Math.random() * 2000,
    )

    return () => clearInterval(interval)
  }, [])

  const Icon = emotion.icon

  return (
    <motion.div
      className={`absolute ${emotion.color} rounded-lg p-4 shadow-lg w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-white`}
      style={{
        top: emotion.position.top,
        left: emotion.position.left,
      }}
      animate={{
        x: position.x,
        y: position.y,
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 5,
        ease: "easeInOut",
      }}
    >
      <Icon size={32} />
    </motion.div>
  )
}
