"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type React from "react"
import { useRef, useState, useEffect, useMemo } from "react"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  isActive?: boolean
  onClick?: () => void
  rotation?: number
  initialRotation?: number
  emojiType?: "rage" | "heart" | "funny" | "sad"
}

export function FeatureCard({
  icon,
  title,
  description,
  color,
  isActive = false,
  onClick,
  rotation = 0,
  initialRotation = 0,
  emojiType,
}: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [showEmojis, setShowEmojis] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { emojiPositions } = useMemo(() => {
    const config = {
      rage: ["😡", "🤬", "💢", "🔥", "💥", "👊", "😤"],
      heart: ["❤️", "💖", "💕", "💓", "💗", "💘", "💝"],
      funny: ["😂", "🤣", "😆", "😝", "🥳", "🎉", "🎊"],
      sad: ["😢", "😭", "💧", "💦", "☔", "☁️", "💔"],
      default: ["✨", "⭐", "🌟"]
    }[emojiType || "default"]

    return {
      emojiPositions: Array.from({ length: isMobile ? 10 : 20 }, () => ({
        x: (Math.random() - 0.5) * (isMobile ? 200 : 400),
        y: (Math.random() - 0.5) * (isMobile ? 200 : 400),
        scale: isMobile ? 0.8 + Math.random() * 0.7 : 1 + Math.random() * 1.5,
        rotation: (Math.random() - 0.5) * 360,
        emoji: config[Math.floor(Math.random() * config.length)],
        duration: isMobile ? 1 + Math.random() * 0.5 : 1.5 + Math.random() * 1,
        delay: Math.random() * 0.3
      }))
    }
  }, [emojiType, isMobile])

  const handleClick = () => {
    if (onClick) onClick()
    if (!isAnimating) {
      setShowEmojis(true)
      setIsAnimating(true)
      setTimeout(() => {
        setShowEmojis(false)
        setIsAnimating(false)
      }, isMobile ? 1500 : 2500)
    }
  }

  return (
    <div className="relative" style={{ perspective: "1000px" }}>
      <motion.div
        ref={cardRef}
        className={cn(
          "rounded-xl cursor-pointer",
          "transform-gpu overflow-visible",
          color,
          "w-full max-w-[300px] md:w-96 p-4 relative", 
          "shadow-[0_0_15px_rgba(255,255,255,0.2)]",
          "flex items-stretch",
          "min-h-[120px] md:min-h-[140px]",
          isActive && "shadow-[0_0_25px_rgba(255,255,255,0.4)]"
        )}
        animate={{
          rotate: initialRotation,
          scale: isActive ? 1.05 : 1,
        }}
        onClick={handleClick}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 0.5,
        }}
      >
        <motion.div 
          className="absolute inset-0 rounded-xl -z-10"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)`,
          }}
        />
        
        <div className="w-[30%] flex items-center justify-center p-2 relative">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl md:text-5xl"> 
              {icon}
            </div>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-3/4 bg-gray-400/30"></div>
        </div>

        <motion.div 
          className="w-[70%] pl-4 flex flex-col justify-center"
          animate={{
            opacity: showEmojis ? 0.6 : 1,
            scale: showEmojis ? 0.95 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-base md:text-lg font-bold text-white/90 line-clamp-2 mb-2">
            {title}
          </h3>
          
          {!isMobile && (
            <p className="text-sm text-white/70 line-clamp-2">
              {description}
            </p>
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showEmojis && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-30"
            style={{
              width: `calc(100% + ${isMobile ? 200 : 400}px)`,
              height: `calc(100% + ${isMobile ? 200 : 400}px)`,
              left: `-${isMobile ? 100 : 200}px`,
              top: `-${isMobile ? 100 : 200}px`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {emojiPositions.map((emoji, index) => (
              <motion.div
                key={index}
                className="absolute text-2xl md:text-4xl"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  willChange: "transform, opacity",
                  zIndex: 30,
                  filter: "drop-shadow(0_2px_4px_rgba(0,0,0,0.3))",
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
                animate={{ 
                  x: emoji.x, 
                  y: emoji.y, 
                  opacity: [0, 1, 1, 0],
                  scale: [0, emoji.scale, emoji.scale * 0.8, 0],
                  rotate: emoji.rotation
                }}
                transition={{ 
                  duration: emoji.duration,
                  delay: emoji.delay,
                  ease: [0.16, 1, 0.3, 1],
                  times: [0, 0.2, 0.8, 1]
                }}
              >
                {emoji.emoji}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}