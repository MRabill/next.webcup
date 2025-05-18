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
import ConstellationBackground from "@/components/effects/constellation-background"
import Image1 from "./images/Group 32.png"
import Image2 from "./images/Group 31.png"
import Image3 from "./images/image 42.png"
import Footer from "./LandingFooter"

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

// Faster floating animation with more energy
const FloatingCardWrapper = memo(({ children, index }: { children: React.ReactNode, index: number }) => {
  // Generate more dynamic random path for each card
  const path = useRef({
    y: [0, -12 + Math.random() * 8, 0, 10 + Math.random() * 6, 0],
    x: [0, 6 + Math.random() * 5, 0, -6 - Math.random() * 5, 0],
    rotate: [0, 1 + Math.random() * 2, 0, -1 - Math.random() * 2, 0]
  }).current

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ y: 0, x: 0, rotate: 0 }}
        animate={path}
        transition={{
          duration: 6 + index * 0.5, // Faster animation
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse"
        }}
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform'
        }}
      >
        {children}
      </motion.div>
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

  // Emotion-based quotes (3 per emotion)
  const emotionQuotes = {
    rage: [
      {
        title: "RAGE AGAINST THE DYING LIGHT",
        keyword: "RAGE",
        subtitle: "Let your anger fuel one last explosive message"
      },
      {
        title: "GO OUT WITH A BANG",
        keyword: "BANG",
        subtitle: "Make sure they remember your fiery exit"
      },
      {
        title: "FURY UNLEASHED",
        keyword: "FURY",
        subtitle: "One final outburst they'll never forget"
      }
    ],
    heart: [
      {
        title: "LOVE NEVER DIES",
        keyword: "LOVE",
        subtitle: "Leave behind words that will keep beating in their hearts"
      },
      {
        title: "FOREVER IN YOUR HEART",
        keyword: "FOREVER",
        subtitle: "A final love letter that will never fade"
      },
      {
        title: "LAST EMBRACE",
        keyword: "EMBRACE",
        subtitle: "Hold them close one final time with your words"
      }
    ],
    funny: [
      {
        title: "LAUGH AT DEATH'S DOOR",
        keyword: "LAUGH",
        subtitle: "Why be serious when you can go out with a joke?"
      },
      {
        title: "MY FINAL DAD JOKE",
        keyword: "JOKE",
        subtitle: "See you later... well, maybe not"
      },
      {
        title: "GRAVE HUMOR",
        keyword: "HUMOR",
        subtitle: "Because even the end should be funny"
      }
    ],
    sad: [
      {
        title: "TEARS IN THE RAIN",
        keyword: "TEARS",
        subtitle: "Let your sorrow flow one last time"
      },
      {
        title: "GOODBYE CRUEL WORLD",
        keyword: "GOODBYE",
        subtitle: "A melancholic farewell for the ages"
      },
      {
        title: "FADING WHISPERS",
        keyword: "WHISPERS",
        subtitle: "Soft words for a quiet departure"
      }
    ],
    default: [
      {
        title: "YOUR GRAND EXIT YOUR WAY",
        keyword: "EXIT",
        subtitle: "Create unforgettable goodbye messages with stunning animations"
      }
    ]
  }

  const [currentEmotion, setCurrentEmotion] = useState<keyof typeof emotionQuotes>("default")
  const [quoteIndex, setQuoteIndex] = useState(0)
  const currentQuote = emotionQuotes[currentEmotion][quoteIndex]
  const [typedTitle, titleDone] = useTypingEffect(currentQuote.title, 100, `${currentEmotion}-${quoteIndex}`) // Fixed reset key

  // Feature cards data
  const features = [
    {
      icon: <Flame className="h-8 w-8 text-red-500" />,
      title: "Rage Mode",
      description: "Express your frustration with explosive animations",
      color: "bg-red-500/10",
      position: "top-[15%] left-[10%]",
      rotation: -12,
      emojiType: "rage" as const,
      emotion: "rage" as const
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: "Heartfelt",
      description: "Share your love with beautiful heart animations",
      color: "bg-pink-500/10",
      position: "top-[20%] right-[10%]",
      rotation: 8,
      emojiType: "heart" as const,
      emotion: "heart" as const
    },
    {
      icon: <Laugh className="h-8 w-8 text-yellow-500" />,
      title: "Funny Farewell",
      description: "Leave them laughing with hilarious effects",
      color: "bg-yellow-500/10",
      position: "bottom-[20%] left-[15%]",
      rotation: -5,
      emojiType: "funny" as const,
      emotion: "funny" as const
    },
    {
      icon: <Frown className="h-8 w-8 text-blue-500" />,
      title: "Sad Goodbye",
      description: "Express your sadness with touching animations",
      color: "bg-blue-500/10",
      position: "bottom-[15%] right-[10%]",
      rotation: 10,
      emojiType: "sad" as const,
      emotion: "sad" as const
    }
  ]

  // Handle card click - change emotion and quote
  const handleFeatureClick = (index: number) => {
    const emotion = features[index].emotion
    setCurrentEmotion(emotion)
    setQuoteIndex(Math.floor(Math.random() * emotionQuotes[emotion].length))
    setActiveFeature(index)
  }

  // Fixed gallery button handler with proper hover effects
  const handleGalleryClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push("/gallery")
  }

  // Rotate through default quotes when no card is selected
  useEffect(() => {
    if (currentEmotion !== "default") return

    const timeout = setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % emotionQuotes.default.length)
    }, titleDone ? 3000 : 0)

    return () => clearTimeout(timeout)
  }, [titleDone, currentEmotion])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-black to-slate-950 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ConstellationBackground
          dotColor="rgba(255, 255, 255, 0.8)"
          lineColor="rgba(255, 255, 255, 0.2)"
          dotCount={380}
          className="z-0"
        />

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

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-[9999] p-6 flex justify-between items-center">

          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-pink-500 mr-2" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-500">
              theend.page
            </h1>
          </div>
          <div className="z-[9999] relative">
            <Button
              onClick={() => {
                setIsExiting(true)
                setTimeout(() => router.push("/gallery"), 1000)
              }}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-lg"
            >
              Gallery <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main content */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="text-center max-w-2xl px-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${currentEmotion}-${quoteIndex}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="mb-8"
              >
                <h2 className="text-3xl md:text-4xl font-extrabold uppercase mb-4 leading-tight tracking-tight">
                  {typedTitle.split(' ').map((word, i) => (
                    <span
                      key={i}
                      className={word === currentQuote.keyword ? "text-pink-500" : "text-white"}
                    >
                      {word}{i < typedTitle.split(' ').length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </h2>
                <p className="text-base md:text-lg text-gray-400 font-medium mb-8">
                  {currentQuote.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
            <Button
              onClick={() => {
                setIsExiting(true)
                setTimeout(() => router.push("/onboarding"), 1000)
              }}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white mt-4"
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
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  color={feature.color}
                  isActive={activeFeature === index}
                  initialRotation={feature.rotation}
                  emojiType={feature.emojiType}
                />
              </FloatingCardWrapper>
            </div>
          ))}
        </div>


      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full bg-slate-950 backdrop-blur-md text-white py-20 px-6 md:px-16 flex flex-col md:flex-row  justify-between gap-12"
      >
        {/* Text Content (Left) */}

        <div className="max-w-xl text-left">
          <h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-500">
            Choose according to your mood
          </h3>
          <p className="text-lg text-gray-300 mb-6">
            Whether it's dramatic, heartfelt, funny or a quiet farewell — your final message deserves to be remembered.
            Let your story echo beyond the end.
          </p>
        </div>
        {/* Image (Right) */}
        <div className="w-full md:w-1/2 max-w-md">
          <motion.img
            src={Image1.src}
            alt="Exit illustration"
            className="w-full h-auto rounded-xl"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="max-w-xl text-left">
          <h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-500">
            AI prompt and gif support
          </h3>
          <p className="text-lg text-gray-300 mb-6">
            Say more than goodbye. Use AI prompts and GIFs to craft a farewell that hits hard — or heals softly.
          </p>
        </div>
        <div className="w-full md:w-1/2 max-w-md">
          <motion.img
            src={Image2.src}
            alt="Exit illustration"
            className="w-full h-auto rounded-xl"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

      </motion.section>
      <Footer />
    </AnimatePresence>
  )
}