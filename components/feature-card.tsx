"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import type React from "react"
import { useRef, useState } from "react"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  borderColor: string
  isActive?: boolean
  onClick?: () => void
  rotation?: number
  initialRotation?: number
}

export function FeatureCard({
  icon,
  title,
  description,
  color,
  borderColor,
  isActive = false,
  onClick,
  rotation = 0,
  initialRotation = 0,
}: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isTilting, setIsTilting] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // More pronounced rotation angles for stronger effect
  const rotateX = useTransform(y, [-100, 100], [35, -35])
  const rotateY = useTransform(x, [-100, 100], [-35, 35])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isTilting) return
    
    const rect = cardRef.current.getBoundingClientRect()
    
    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Update motion values
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseEnter = () => {
    setIsTilting(true)
  }

  const handleMouseLeave = () => {
    setIsTilting(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "rounded-xl p-4 border w-64 backdrop-blur-sm cursor-pointer transition-all",
        "transform-gpu",
        color,
        borderColor,
        isActive && "ring-2 ring-white/20",
        isTilting ? "shadow-2xl" : "shadow-xl"
      )}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        rotateX: isTilting ? rotateX : initialRotation ? 0 : 0,
        rotateY: isTilting ? rotateY : 0,
        rotate: isTilting ? 0 : initialRotation,
      }}
      whileHover={{ 
        scale: 1.05, 
        zIndex: 20,
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      transition={{ duration: 0.3 }}
    >
      {/* Card background with gradient */}
      <motion.div 
        className="absolute inset-0 rounded-xl opacity-30 -z-10"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)",
          transformStyle: "preserve-3d",
          translateZ: -20,
        }}
      />
      
      {/* Card content */}
      <motion.div 
        className="relative z-10 transform-gpu"
        style={{ 
          transformStyle: "preserve-3d", 
          translateZ: 30,
        }}
      >
        <div className="mb-3">{icon}</div>
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-sm text-slate-300">{description}</p>
      </motion.div>
    </motion.div>
  )
}
