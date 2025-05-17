"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"
import ConstellationBackground from "@/components/effects/constellation-background"
import { moods } from "@/lib/data"
import AudioPlayer from "@/components/ui/audio-player"
import { getMusicForMood } from "@/lib/music"

export default function LandingPage() {
  const [activeMood, setActiveMood] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const moodCards = [
    {
      id: "rage",
      name: "Rage Mode",
      description: "Express your frustration with explosive animations and effects",
      position: { top: "15%", left: "10%" },
      delay: 0.2,
    },
    {
      id: "heartfelt",
      name: "Heartfelt Goodbyes",
      description: "Create sincere, emotional farewells with floating hearts",
      position: { top: "20%", right: "10%" },
      delay: 0.4,
    },
    {
      id: "calm",
      name: "Calm Farewells",
      description: "Peaceful, serene goodbyes with gentle particles",
      position: { top: "45%", left: "5%" },
      delay: 0.6,
    },
    {
      id: "funny",
      name: "Funny Exits",
      description: "Light-hearted goodbyes with confetti and bouncing emojis",
      position: { top: "40%", left: "15%" },
      delay: 0.8,
    },
    {
      id: "robotic",
      name: "Robotic Terminations",
      description: "Cold, calculated exits with digital glitch effects",
      position: { top: "35%", right: "15%" },
      delay: 1.0,
    },
    {
      id: "sad",
      name: "Sad Departures",
      description: "Set the mood with rain effects and melancholic visuals",
      position: { top: "60%", right: "10%" },
      delay: 1.2,
    },
  ]

  const getMoodIcon = (moodId: string) => {
    const mood = moods.find((m) => m.id === moodId)
    if (!mood || !mood.icon) return null

    const Icon = mood.icon
    return (
      <div className={`bg-${mood.color}-500/20 p-3 rounded-full`}>
        <Icon className={`text-${mood.color}-400`} size={24} />
      </div>
    )
  }

  const getMoodGradient = (moodId: string) => {
    switch (moodId) {
      case "heartfelt":
        return "from-pink-500/20 to-purple-500/20"
      case "rage":
        return "from-red-600/20 to-orange-500/20"
      case "funny":
        return "from-yellow-400/20 to-orange-400/20"
      case "sad":
        return "from-blue-500/20 to-indigo-500/20"
      case "calm":
        return "from-green-400/20 to-teal-500/20"
      case "robotic":
        return "from-slate-600/20 to-slate-700/20"
      default:
        return "from-slate-600/20 to-slate-700/20"
    }
  }

  const currentMusic = activeMood ? getMusicForMood(activeMood) : null

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white">
      {/* Background */}
      <ConstellationBackground className="z-0" />

      {/* Audio player */}
      {currentMusic && (
        <AudioPlayer
          src={currentMusic.src}
          autoPlay={true}
          loop={true}
          volume={0.2}
          className="fixed bottom-4 right-4 z-50"
          showTitle={true}
          title={currentMusic.title}
          artist={currentMusic.artist}
        />
      )}

      {/* Navigation */}
      <nav className="container mx-auto p-4 flex justify-between items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <div className="text-2xl font-bold flex items-center">
            <span className="text-pink-500">the</span>
            <span>end</span>
            <span className="text-pink-500">.</span>
            <span>page</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex gap-4 items-center"
        >
          <ThemeToggle />
          <Link href="/gallery">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Gallery
            </Button>
          </Link>
          <Link href="/create">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white">
              Exit With Style
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </nav>

      {/* Floating mood cards */}
      <AnimatePresence>
        {isLoaded &&
          moodCards.map((card) => (
            <motion.div
              key={card.id}
              className="absolute z-10"
              style={{
                top: card.position.top,
                left: card.position.left,
                right: card.position.right,
                maxWidth: "280px",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: card.delay }}
              whileHover={{ scale: 1.05, y: -5 }}
              onMouseEnter={() => setActiveMood(card.id)}
              onMouseLeave={() => setActiveMood(null)}
            >
              <div
                className={`bg-gradient-to-br ${getMoodGradient(card.id)} backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {getMoodIcon(card.id)}
                  <h3 className="font-bold">{card.name}</h3>
                </div>
                <p className="text-sm text-gray-300">{card.description}</p>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Hero section */}
      <main className="container mx-auto px-4 py-20 flex flex-col items-center text-center relative z-10 mt-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Grand Exit
          </span>
          ,<br />
          Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Way
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl max-w-3xl mb-10 text-gray-300"
        >
          Create unforgettable goodbye messages with stunning animations and effects
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/create">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white px-8 py-6 text-lg rounded-full"
            >
              Create Your Exit Page
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  )
}
