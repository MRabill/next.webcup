"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type React from "react"
import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselItem {
  title: string
  description: string
  image?: string
  color?: string
}

// Define emoji types for each feature type
interface EmojiConfig {
  emojis: string[]
  count: number
}

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
  carouselItems?: CarouselItem[]
  emojiType?: "rage" | "heart" | "funny" | "sad" // Type of emojis to show
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
  carouselItems = [],
  emojiType,
}: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const [showEmojis, setShowEmojis] = useState(false)
  const [hasTriggeredEmojis, setHasTriggeredEmojis] = useState(false)
  
  // Setup emoji configuration based on the emoji type
  const getEmojiConfig = (): EmojiConfig => {
    switch(emojiType) {
      case "rage":
        return { 
          emojis: ["😡", "🤬", "💢", "🔥", "💥", "👊", "😤"],
          count: 10
        };
      case "heart":
        return { 
          emojis: ["❤️", "💖", "💕", "💓", "💗", "💘", "💝"],
          count: 10
        };
      case "funny":
        return { 
          emojis: ["😂", "🤣", "😆", "😝", "🥳", "🎉", "🎊"],
          count: 10
        };
      case "sad":
        return { 
          emojis: ["😢", "😭", "💧", "💦", "☔", "☁️", "💔"],
          count: 10
        };
      default:
        return { 
          emojis: ["✨", "⭐", "🌟"],
          count: 8
        };
    }
  };
    // Generate fixed emoji positions only once
  const [emojiPositions] = useState(() => {
    const config = getEmojiConfig();
    return Array.from({ length: config.count }, () => ({
      x: Math.random() * 500 - 250, // Wider spread: -250px to 250px (increased from 300px range)
      y: Math.random() * 500 - 250, // Wider spread: -250px to 250px (increased from 300px range)
      scale: 1.5 + Math.random() * 0.3, // Smaller scale: 1.5-1.8 (reduced from 2-2.5)
      rotation: Math.random() * 360,
      emoji: config.emojis[Math.floor(Math.random() * config.emojis.length)],
      duration: 4, // Fixed duration - more predictable
    }));
  });
  
  const handleClick = () => {
    if (onClick && !isExpanded) onClick()
    setIsExpanded(!isExpanded)
  }
  
  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDirection(1)
    setActiveSlide((prev) => (prev + 1) % carouselItems.length)
  }
  
  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDirection(-1)
    setActiveSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }
  
  // Reset the slide when card is collapsed
  useEffect(() => {
    if (!isExpanded) {
      setActiveSlide(0)
    }
  }, [isExpanded])
  
  // Add click outside listener to close card
  useEffect(() => {
    if (!isExpanded) return
    
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
        if (onClick) onClick()
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded, onClick])

  // Carousel variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
      zIndex: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
      rotateY: direction < 0 ? 45 : -45,
      scale: 0.8,
      zIndex: 0,
    }),
  }
  
  // Simplified hover handling
  const handleHoverStart = () => {
    if (!isExpanded && !showEmojis) {
      setShowEmojis(true)
      setHasTriggeredEmojis(true)
    }
  }
  
  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "rounded-xl border backdrop-blur-sm cursor-pointer transition-all",
        "transform-gpu",
        color,
        borderColor,
        isActive && "ring-2 ring-white/20",
        isExpanded ? "w-[500px] h-[400px] z-30" : "w-64 p-4"
      )}
      // Fixed animation values instead of dynamic tilting
      animate={{
        scale: isExpanded ? 1.2 : 1,
        rotate: isExpanded ? 0 : initialRotation,
        boxShadow: isActive ? "0 0 20px rgba(255, 255, 255, 0.2)" : "0 10px 30px rgba(0, 0, 0, 0.1)",
      }}
      whileHover={{
        scale: isExpanded ? 1.2 : 1.05,
        zIndex: isExpanded ? 50 : 20,
      }}
      onHoverStart={handleHoverStart}
      onClick={handleClick}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1.2,
      }}
      layout
    >
      {/* Card background with gradient */}
      <motion.div 
        className="absolute inset-0 rounded-xl opacity-30 -z-10"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)",
        }}
        layout
      />
      
      {/* Flying emojis when hovering - with guaranteed full animation cycle */}
      {!isExpanded && emojiType && (
        <AnimatePresence>
          {showEmojis && (
            <motion.div
              className="absolute inset-0 overflow-visible pointer-events-none z-30"
              onAnimationComplete={() => {
                setShowEmojis(false);
              }}
            >
              {emojiPositions.map((emoji, index) => (
                <motion.div
                  key={index}
                  className="absolute text-4xl" // Reduced from text-5xl to text-4xl
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 0,
                    scale: 0,
                    rotate: 0
                  }}
                  animate={{ 
                    x: emoji.x, 
                    y: emoji.y, 
                    opacity: [0, 1, 1, 0],
                    scale: [0, emoji.scale, emoji.scale, 0],
                    rotate: emoji.rotation
                  }}
                  transition={{ 
                    duration: emoji.duration,
                    ease: "easeOut",
                    times: [0, 0.1, 0.7, 1]
                  }}
                  style={{
                    left: "50%",
                    top: "50%",
                    filter: "drop-shadow(0 0 5px rgba(0,0,0,0.7))",
                    transform: "translate(-50%, -50%)"
                  }}
                >
                  {emoji.emoji}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      {!isExpanded ? (
        /* Normal card content */
        <motion.div 
          className="relative z-10"
          layout
        >
          <div className="mb-3">{icon}</div>
          <h3 className="text-lg font-bold mb-1">{title}</h3>
          <p className="text-sm text-slate-300">{description}</p>
        </motion.div>
      ) : (
        /* Expanded card with 3D carousel */
        <motion.div 
          className="relative w-full h-full p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ 
            perspective: "1200px",
          }}
          layout
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
          
          {/* 3D Carousel */}
          <div className="relative w-full h-[300px] perspective-[1200px]">
            {/* Navigation buttons */}
            {carouselItems.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 rounded-full p-1.5"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 rounded-full p-1.5"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </>
            )}
            
            {/* Carousel Content */}
            <div className="h-full w-full relative overflow-hidden">
              <AnimatePresence custom={direction} initial={false}>
                <motion.div
                  key={activeSlide}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    rotateY: { duration: 0.8 },
                  }}
                  className="absolute inset-0 transform-gpu"
                  style={{ 
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="p-4 h-full flex flex-col">
                    <h4 className="text-lg font-semibold mb-2">
                      {carouselItems[activeSlide]?.title || title}
                    </h4>
                    <p className="text-sm text-slate-300 flex-grow">
                      {carouselItems[activeSlide]?.description || description}
                    </p>
                    
                    <ul className="mt-3 space-y-1">
                      <li className="flex items-center text-sm text-white">
                        <span className="bg-white/20 p-0.5 text-xs rounded-full mr-1.5">✓</span>
                        Customizable animations
                      </li>
                      <li className="flex items-center text-sm text-white">
                        <span className="bg-white/20 p-0.5 text-xs rounded-full mr-1.5">✓</span>
                        Interactive elements
                      </li>
                      <li className="flex items-center text-sm text-white">
                        <span className="bg-white/20 p-0.5 text-xs rounded-full mr-1.5">✓</span>
                        Share on social media
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Slide indicators */}
            {carouselItems.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5 z-30">
                {carouselItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDirection(index > activeSlide ? 1 : -1);
                      setActiveSlide(index);
                    }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      activeSlide === index ? "bg-white" : "bg-white/40 hover:bg-white/60"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
