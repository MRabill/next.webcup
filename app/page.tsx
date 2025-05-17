"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { Sparkles, Flame, Heart, Frown, Cloud, Bot, Laugh, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { FeatureCard } from "@/components/feature-card"
import { BackgroundAnimation } from "@/components/background-animation"

export default function LandingPage() {
  const router = useRouter()
  const [activeFeature, setActiveFeature] = useState<number | null>(null)
  const [isExiting, setIsExiting] = useState(false)

  // Create four featured cards for the corners
  const features = [
    {
      icon: <Flame className="h-8 w-8 text-red-500" />,
      title: "Rage Mode",
      description: "Express your frustration with explosive animations and effects",
      color: "bg-red-500/10",
      borderColor: "border-red-500/20",
      position: "top-[15%] left-[10%]", // Top left
      rotation: -12,
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: "Heartfelt Goodbyes",
      description: "Create sincere, emotional farewells with floating hearts",
      color: "bg-pink-500/10",
      borderColor: "border-pink-500/20",
      position: "top-[15%] right-[10%]", // Top right
      rotation: 12,
    },
    {
      icon: <Laugh className="h-8 w-8 text-yellow-500" />,
      title: "Funny Exits",
      description: "Leave them laughing with confetti and bouncing emojis",
      color: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      position: "bottom-[15%] left-[10%]", // Bottom left
      rotation: 12,
    },
    {
      icon: <Frown className="h-8 w-8 text-blue-500" />,
      title: "Sad Departures",
      description: "Set the mood with rain effects and melancholic visuals",
      color: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      position: "bottom-[15%] right-[10%]", // Bottom right
      rotation: -12,
    },
  ]

  const handleExitClick = () => {
    setIsExiting(true)
    setTimeout(() => {
      router.push("/onboarding")
    }, 1000)
  }

  useEffect(() => {
    // Cycle through features automatically
    const interval = setInterval(() => {
      setActiveFeature((prev) => {
        if (prev === null || prev >= features.length - 1) {
          return 0
        }
        return prev + 1
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [features.length])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackgroundAnimation />

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-center">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-pink-500 mr-2" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-500">
              theend.page
            </h1>
          </div>
          <Button
            onClick={handleExitClick}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
            size="lg"
          >
            Exit With Style <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </header>

        {/* Center Quote */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="text-center max-w-3xl px-6">
            <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
              Your Grand Exit, Your Way
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 mb-8">
              Create unforgettable goodbye messages with stunning animations and effects
            </p>
            <Button
              onClick={handleExitClick}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-lg"
            >
              Create Your Exit Page <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Feature Cards - placed in corners with 3D effect */}
        <div className="perspective-[1200px] absolute inset-0">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={cn("absolute z-10", feature.position)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: activeFeature === index ? 1.05 : 1,
                boxShadow: activeFeature === index ? "0 0 20px rgba(255, 255, 255, 0.2)" : "none",
              }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                borderColor={feature.borderColor}
                isActive={activeFeature === index}
                onClick={() => setActiveFeature(index)}
                initialRotation={feature.rotation}
              />
            </motion.div>
          ))}
        </div>

        {/* Exit Animation Overlay */}
        {isExiting && (
          <motion.div
            className="absolute inset-0 bg-black z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
