"use client"

import { useState, useEffect, useRef, memo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { Sparkles, Flame, Heart, Frown, Laugh, ArrowRight, PartyPopper, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"
import { FeatureCard } from "@/components/feature-card"
import { BackgroundAnimation } from "@/components/background-animation"
import AudioPlayer from "@/components/ui/audio-player"
// import localFont from 'next/font/local'

// // Load custom font - replace with your actual font file
// const myFont = localFont({ 
//   src: '../fonts/YourFontName.woff2',
//   display: 'swap'
// })

// Typing effect hook
function useTypingEffect(text: string, speed: number, resetKey: any) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  useEffect(() => {
    setDisplayed("")
    setDone(false)
    if (!text) return
    let i = 0
    const typeNext = () => {
      setDisplayed(text.slice(0, i + 1))
      if (i < text.length - 1) {
        i++
        setTimeout(typeNext, speed)
      } else {
        setDone(true)
      }
    }
    typeNext()
    return () => setDone(true)
  }, [text, speed, resetKey])
  return [displayed, done] as const
}

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// Faster floating animation component
const FloatingCardWrapper = memo(({ children, index }: { children: React.ReactNode, index: number }) => {
  return (
    <motion.div
      initial={{ y: 0, x: 0, rotate: 0 }}
      animate={{
        y: [0, -20, 0, 20, 0], // Increased floating range
        x: [0, 15, 0, -15, 0],  // Increased floating range
        rotate: [0, 3, 0, -3, 0] // Slightly more rotation
      }}
      transition={{
        duration: 5 + index * 0.2, // Faster animation
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      {children}
    </motion.div>
  )
})

export default function LandingPage() {
  const router = useRouter()
  const [activeFeature, setActiveFeature] = useState<number | null>(null)
  const [isExiting, setIsExiting] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [easterEgg, setEasterEgg] = useState(false)
  const keyBuffer = useRef<string>("")
  const isMobile = useIsMobile()
  const animationFrameRef = useRef<number | null>(null)

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Easter egg handlers
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      keyBuffer.current += e.key.toLowerCase()
      if (keyBuffer.current.length > 10) keyBuffer.current = keyBuffer.current.slice(-10)
      if (keyBuffer.current.includes("wow")) {
        setEasterEgg(true)
        keyBuffer.current = ""
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  useEffect(() => {
    if (!easterEgg) return
    const timeout = setTimeout(() => setEasterEgg(false), 3500)
    return () => clearTimeout(timeout)
  }, [easterEgg])

  // Quote carousel
  const quotes = [
    {
      title: "YOUR GRAND EXIT, YOUR WAY",
      subtitle: "Create unforgettable goodbye messages with stunning animations and effects",
    },
    {
      title: "EXPRESS YOURSELF",
      subtitle: "Share your final thoughts with style and personality",
    },
    {
      title: "LEAVE A LASTING IMPRESSION",
      subtitle: "Make your goodbye memorable with custom animations",
    }
  ]
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [typedTitle, titleDone] = useTypingEffect(quotes[quoteIndex].title, 120, quoteIndex)

  useEffect(() => {
    if (!titleDone) return
    const timeout = setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length)
    }, 1500)
    return () => clearTimeout(timeout)
  }, [titleDone, quotes.length])

  // Feature cards data
  const features = [
    {
      icon: <Flame className="h-10 w-10 text-red-500" />, // Larger icon
      title: "Rage Mode",
      description: "Express your frustration with explosive animations",
      color: "bg-red-500/10",
      position: "top-[15%] left-[10%]",
      rotation: -12,
      emojiType: "rage" as const
    },
    {
      icon: <Heart className="h-10 w-10 text-pink-500" />, // Larger icon
      title: "Heartfelt",
      description: "Share your love with beautiful heart animations",
      color: "bg-pink-500/10",
      position: "top-[20%] right-[10%]",
      rotation: 8,
      emojiType: "heart" as const
    },
    {
      icon: <Laugh className="h-10 w-10 text-yellow-500" />, // Larger icon
      title: "Funny Farewell",
      description: "Leave them laughing with hilarious effects",
      color: "bg-yellow-500/10",
      position: "bottom-[20%] left-[15%]",
      rotation: -5,
      emojiType: "funny" as const
    },
    {
      icon: <Frown className="h-10 w-10 text-blue-500" />, // Larger icon
      title: "Sad Goodbye",
      description: "Express your sadness with touching animations",
      color: "bg-blue-500/10",
      position: "bottom-[15%] right-[10%]",
      rotation: 10,
      emojiType: "sad" as const
    }
  ]

  // Card interaction handlers
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null)

  const handleFeatureClick = (index: number) => {
    if (expandedCardIndex === index) {
      setExpandedCardIndex(null)
    } else {
      setExpandedCardIndex(index)
      setActiveFeature(null)
    }
  }

  // Feature rotation animation
  useEffect(() => {
    if (expandedCardIndex !== null) return

    const rotateFeatures = () => {
      setActiveFeature(prev => {
        if (prev === null || prev >= features.length - 1) return 0
        return prev + 1
      })
      animationFrameRef.current = requestAnimationFrame(rotateFeatures)
    }

    const timeout = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(rotateFeatures)
    }, 3000)

    return () => {
      clearTimeout(timeout)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [features.length, expandedCardIndex])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={`relative h-screen w-screen overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 text-white`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackgroundAnimation />

        {/* Audio controls */}
        <div className="fixed bottom-4 right-4 z-20 flex items-center gap-3">
          <Button
            onClick={() => setIsMuted(!isMuted)}
            size="icon"
            className="rounded-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-600 hover:to-pink-600 text-white h-10 w-10 flex items-center justify-center"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <motion.div
            className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-1.5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center"
            >
              <span className="text-xs text-white/90 mr-2">Now Playing:</span>
              <span className="text-sm font-medium text-white">Adele - Skyfall</span>
            </motion.div>
          </motion.div>
          <AudioPlayer
            src="/sounds/thisIsTheEnd.mp3"
            autoPlay={!isMuted}
            loop={true}
            volume={isMuted ? 0 : 0.3}
            className="w-auto"
          />
        </div>

        {/* Easter Egg */}
        <AnimatePresence>
          {easterEgg && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <motion.div
                className="bg-gradient-to-br from-pink-500 to-yellow-400 rounded-2xl px-12 py-10 flex flex-col items-center"
                initial={{ rotate: -10 }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: 2, duration: 1.2 }}
              >
                <PartyPopper className="w-16 h-16 mb-4 text-white animate-bounce" />
                <h3 className="text-3xl font-extrabold mb-2 text-white">WOW! 🎉</h3>
                <p className="text-lg text-white/90">You found the secret! Enjoy this little celebration. 🥳</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-center">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-pink-500 mr-2" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-500">
              theend.page
            </h1>
          </div>
          <Button
            onClick={() => {
              setIsExiting(true)
              setTimeout(() => router.push("/gallery"), 1000)
            }}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
            size="lg"
          >
            Gallery <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </header>

        {/* Main content */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="text-center max-w-3xl px-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <h2 className="text-4xl md:text-6xl font-extrabold uppercase mb-6 leading-tight tracking-tighter">
                  {typedTitle}
                </h2>
                <p className="text-base md:text-lg text-gray-400 mb-8 mt-4 font-normal">
                  {quotes[quoteIndex].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
            <Button
              onClick={() => {
                setIsExiting(true)
                setTimeout(() => router.push("/onboarding"), 1000)
              }}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-lg"
            >
              Create Your Exit Page <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Floating Feature Cards */}
        <div className="absolute inset-0 overflow-hidden">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "absolute z-10 cursor-pointer",
                feature.position
              )}
              onClick={() => handleFeatureClick(index)}
            >
              <FloatingCardWrapper index={index}>
                <motion.div
                  initial={{ rotate: feature.rotation, opacity: 0 }}
                  animate={{
                    rotate: expandedCardIndex === index ? 0 : feature.rotation,
                    opacity: 1,
                    scale: expandedCardIndex === index ? 1.1 : (activeFeature === index) ? 1.05 : 1
                  }}
                  transition={{
                    type: 'spring',
                    damping: 15,
                    stiffness: 100,
                    mass: 0.5,
                    restDelta: 0.001
                  }}
                >
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    color={feature.color}
                    isActive={activeFeature === index}
                    initialRotation={feature.rotation}
                    emojiType={feature.emojiType}
                  />
                </motion.div>
              </FloatingCardWrapper>
            </div>
          ))}
        </div>

        {/* Exit overlay */}
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