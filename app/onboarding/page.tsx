"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Frown, Angry, Laugh, ThumbsUp, Zap, ArrowRight, ArrowLeft, User, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { EmotionTone } from "@/lib/types"
import TonePreview from "@/components/tone-preview"
import ConstellationBackground from "@/components/effects/constellation-background"

export default function OnboardingPage() {
  const router = useRouter()
  const [selectedTone, setSelectedTone] = useState<string | null>(null)
  const [situation, setSituation] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [mood, setMood] = useState("default")
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const emotionTones: EmotionTone[] = [
    {
      id: "angry",
      name: "Rage Mode",
      description: "Let out all your frustration and anger",
      color: "bg-red-500",
      prompt: "Write an angry departure message from my perspective as someone who was fired from their job",
    },
    {
      id: "sad",
      name: "Tearful Goodbye",
      description: "Express your sadness and nostalgia",
      color: "bg-blue-500",
      prompt: "Write a sad, emotional goodbye message from my perspective as someone leaving a job I loved",
    },
    {
      id: "happy",
      name: "Joyful Exit",
      description: "Celebrate your new beginning with joy",
      color: "bg-yellow-500",
      prompt: "Write a happy, optimistic departure message from my perspective as someone starting a new chapter",
    },
    {
      id: "sarcastic",
      name: "Sarcastic Farewell",
      description: "Say goodbye with wit and sarcasm",
      color: "bg-purple-500",
      prompt: "Write a sarcastic, witty goodbye message from my perspective as someone leaving a toxic workplace",
    },
    {
      id: "grateful",
      name: "Grateful Departure",
      description: "Express gratitude for the experience",
      color: "bg-green-500",
      prompt: "Write a grateful, appreciative goodbye message from my perspective as someone leaving a team",
    },
    {
      id: "dramatic",
      name: "Dramatic Exit",
      description: "Make your exit as dramatic as possible",
      color: "bg-orange-500",
      prompt: "Write a dramatic, over-the-top goodbye message from my perspective as someone ending a relationship",
    },
  ]

  // Play start sound when component mounts
  useEffect(() => {
    const audio = new Audio("/sounds/start.mp3")
    audio.volume = 0.5
    audio.play().catch((err) => console.error("Failed to play start sound:", err))
    audioRef.current = audio

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  // Handle mood changes when tone is selected
  useEffect(() => {
    if (selectedTone) {
      switch (selectedTone) {
        case "angry":
          setMood("rage")
          break
        case "sad":
          setMood("sad")
          break
        case "happy":
          setMood("funny")
          break
        case "sarcastic":
          setMood("robotic")
          break
        case "grateful":
          setMood("calm")
          break
        default:
          setMood("default")
      }
    }
  }, [selectedTone])

  // Start animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 3000) // Reduced duration for better user experience

    return () => clearTimeout(timer)
  }, [])

  // Check for existing user information in localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem('endpage_username')
    const savedEmail = localStorage.getItem('endpage_email')

    if (savedUsername && savedEmail) {
      setUsername(savedUsername)
      setEmail(savedEmail)
    }
  }, [])

  const nextStep = () => {
    // Save user info to localStorage when proceeding from first step
    if (currentStep === 0) {
      if (!username || !email) return;

      localStorage.setItem('endpage_username', username)
      localStorage.setItem('endpage_email', email)

      // Also save selected mood if user has already chosen one
      if (selectedTone) {
        localStorage.setItem('endpage_tone', selectedTone)
      }

      if (situation) {
        localStorage.setItem('endpage_situation', situation)
      }

      // Redirect directly to create page with user information
      router.push('/create')
      return
    }

    if (currentStep === 0 && (!username || !email)) return
    if (currentStep === 1 && !situation) return
    if (currentStep === 2 && !selectedTone) return
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!selectedTone || !situation || !username || !email) return

    setLoading(true)

    // Save user info to localStorage
    localStorage.setItem('endpage_username', username)
    localStorage.setItem('endpage_email', email)
    localStorage.setItem('endpage_situation', situation)
    localStorage.setItem('endpage_tone', selectedTone)

    // Simulate API call to OpenAI
    setTimeout(() => {
      router.push("/create")
    }, 1500)
  }

  const getIconForTone = (toneId: string) => {
    switch (toneId) {
      case "angry":
        return Angry
      case "sad":
        return Frown
      case "happy":
        return Laugh
      case "sarcastic":
        return Zap
      case "grateful":
        return ThumbsUp
      case "dramatic":
        return Heart
      default:
        return Zap
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-slate-950 text-white p-4 overflow-hidden relative">
      {/* Dynamic Background Effects */}
      <ConstellationBackground
        dotColor="rgba(255, 255, 255, 0.8)"
        lineColor="rgba(255, 255, 255, 0.2)"
        dotCount={380}
        className="z-0"
        mood={mood}
      />
      {/* Cinematic Intro Animation */}
      <AnimatePresence>
        {!animationComplete && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, delay: 2.0 }}
          >
            {/* Skip button */}
            <button
              onClick={() => setAnimationComplete(true)}
              className="absolute bottom-4 right-4 px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm text-white/70 hover:text-white transition-colors"
            >
              Skip
            </button>
            {/* Movie-like dramatic line */}
            <motion.div
              className="h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent"
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />
            {/* Main title with typewriter effect */}
            <motion.h1
              className="mt-6 mb-4 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              Welcome to Your End Page
            </motion.h1>
            {/* Tagline with fade-in */}
            <motion.p
              className="text-lg text-gray-300 mt-4 max-w-lg text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              Create memorable departure messages with style, emotion, and impact
            </motion.p>
            {/* Emotion icons that fly in from different directions */}
            <motion.div className="flex gap-8 mt-8">
              {[
                { icon: "💔", delay: 1.3, x: -100 },
                { icon: "😢", delay: 1.4, y: 80 },
                { icon: "🔥", delay: 1.5, x: 100 },
                { icon: "👋", delay: 1.6, y: -80 },
                { icon: "✨", delay: 1.7, x: -80, y: -80 }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-4xl"
                  initial={{
                    opacity: 0,
                    x: item.x || 0,
                    y: item.y || 0,
                    scale: 0.5
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1
                  }}
                  transition={{
                    duration: 0.8,
                    delay: item.delay,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  {item.icon}
                </motion.div>
              ))}
            </motion.div>
            {/* Bottom dramatic line */}
            <motion.div
              className="h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent mt-8"
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              transition={{ duration: 0.7, delay: 1.8, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto max-w-4xl py-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Create Your End Page
          </h1>
          <p className="text-lg text-center mb-10 text-gray-400">
            Tell us about your departure and choose how you want to express it
          </p>
        </motion.div>

        {/* Multi-step Content */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 gap-8"
              >
                <div className="flex justify-center">
                  <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-none text-white shadow-xl">

                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center">
                        <User className="mr-2 h-6 w-6 text-purple-400" />
                        <span>Who are you?</span>
                      </CardTitle>
                      <CardDescription className="text-gray-300 text-base">Tell us a bit about yourself</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="username" className="text-lg">Username</Label>
                          <Input
                            id="username"
                            placeholder="Enter your username"
                            className="bg-white/5 border-white/20 text-white text-lg h-12"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="email" className="text-lg">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="bg-white/5 border-white/20 text-white text-lg h-12"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </motion.div>
                      </div>
                    </CardContent>                  
                    <CardFooter className="flex justify-center">
                      <Button
                        onClick={nextStep}
                        disabled={!username || !email}
                        variant="gradient" >
                        <span>Go to Create Page</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </CardFooter>

                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Indicators */}
        <motion.div
          className="flex justify-center mt-10 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[0].map((step) => (
            <motion.div
              key={step}
              className={`h-3 w-3 rounded-full ${currentStep === step
                ? "bg-gradient-to-r from-pink-500 to-purple-500"
                : "bg-white/30"
                }`}
              animate={{
                scale: currentStep === step ? [1, 1.2, 1] : 1,
                transition: {
                  duration: 0.5,
                  repeat: currentStep === step ? Infinity : 0,
                  repeatType: "reverse"
                }
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
