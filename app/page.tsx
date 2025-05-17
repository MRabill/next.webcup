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
      carouselItems: [
        {
          title: "Rage Mode",
          description: "Let your emotions out with our explosive Rage Mode exit pages. Perfect for saying goodbye to things that frustrate you. Features include flame effects, explosive animations, and screen shaking for maximum impact.",
          color: "bg-red-500/30",
        },
        {
          title: "Customize Your Rage",
          description: "Choose from multiple anger levels, from mild annoyance to full-blown fury. Each level comes with unique visual and audio effects that match the intensity of your feelings.",
          color: "bg-red-600/30",
        },
        {
          title: "Special Effects",
          description: "Add dramatic sound effects, screen cracks, particle explosions and more to create an exit page that truly expresses your frustration in style.",
          color: "bg-orange-500/30",
        }
      ]
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: "Heartfelt Goodbyes",
      description: "Create sincere, emotional farewells with floating hearts",
      color: "bg-pink-500/10",
      borderColor: "border-pink-500/20",
      position: "top-[15%] right-[10%]", // Top right
      rotation: 12,
      carouselItems: [
        {
          title: "Heartfelt Goodbyes",
          description: "Create meaningful farewell messages with our emotional templates. Perfect for telling someone how much they mean to you or expressing gratitude for shared experiences.",
          color: "bg-pink-500/30",
        },
        {
          title: "Emotional Effects",
          description: "Choose from a variety of heartwarming animations, including floating hearts, gentle particle effects, and warm color transitions to complement your message.",
          color: "bg-pink-600/30",
        },
        {
          title: "Personal Touch",
          description: "Add photos, personal messages, and custom music to create a truly memorable goodbye experience for someone special.",
          color: "bg-rose-400/30",
        }
      ]
    },
    {
      icon: <Laugh className="h-8 w-8 text-yellow-500" />,
      title: "Funny Exits",
      description: "Leave them laughing with confetti and bouncing emojis",
      color: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      position: "bottom-[15%] left-[10%]", // Bottom left
      rotation: 12,
      carouselItems: [
        {
          title: "Funny Exits",
          description: "End on a high note with our humorous exit pages. Perfect for light-hearted goodbyes or when you want to leave people smiling as you go.",
          color: "bg-yellow-500/30",
        },
        {
          title: "Comedy Elements",
          description: "Add bouncing emojis, confetti explosions, silly sound effects, and animated jokes to keep the mood light and entertaining.",
          color: "bg-yellow-600/30",
        },
        {
          title: "Meme Generator",
          description: "Include popular memes and customize them with your own text to create a personalized funny exit that will be remembered.",
          color: "bg-amber-500/30",
        }
      ]
    },
    {
      icon: <Frown className="h-8 w-8 text-blue-500" />,
      title: "Sad Departures",
      description: "Set the mood with rain effects and melancholic visuals",
      color: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      position: "bottom-[15%] right-[10%]", // Bottom right
      rotation: -12,
      carouselItems: [
        {
          title: "Sad Departures",
          description: "For those difficult goodbyes, our melancholic templates help express the emotions of parting. Perfect for solemn or bittersweet farewells.",
          color: "bg-blue-500/30",
        },
        {
          title: "Melancholic Effects",
          description: "Set the mood with gentle rain animations, fading colors, and slow transitions that capture the feeling of a meaningful ending.",
          color: "bg-blue-600/30",
        },
        {
          title: "Emotional Music",
          description: "Choose from a selection of moving background music and sound effects to complement your farewell message.",
          color: "bg-indigo-500/30",
        }
      ]
    },
  ]

  const handleExitClick = () => {
    setIsExiting(true)
    setTimeout(() => {
      router.push("/onboarding")
    }, 1000)
  }

  // Keep track of expanded card to pause the rotation
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null)

  const handleFeatureClick = (index: number) => {
    // Toggle expanded state
    if (expandedCardIndex === index) {
      setExpandedCardIndex(null)
    } else {
      setExpandedCardIndex(index)
    }
  }

  useEffect(() => {
    // Only cycle through features when no card is expanded
    if (expandedCardIndex !== null) return

    const interval = setInterval(() => {
      setActiveFeature((prev) => {
        if (prev === null || prev >= features.length - 1) {
          return 0
        }
        return prev + 1
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [features.length, expandedCardIndex])

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
                scale: (activeFeature === index && expandedCardIndex === null) ? 1.05 : 1,
                boxShadow: (activeFeature === index && expandedCardIndex === null) ? "0 0 20px rgba(255, 255, 255, 0.2)" : "none",
              }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                borderColor={feature.borderColor}
                isActive={activeFeature === index && expandedCardIndex === null}
                onClick={() => handleFeatureClick(index)}
                initialRotation={feature.rotation}
                carouselItems={feature.carouselItems}
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
