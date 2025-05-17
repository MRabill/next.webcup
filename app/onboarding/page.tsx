"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Heart, Frown, Angry, Laugh, ThumbsUp, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { EmotionTone } from "@/lib/types"
import TonePreview from "@/components/tone-preview"

export default function OnboardingPage() {
  const router = useRouter()
  const [selectedTone, setSelectedTone] = useState<string | null>(null)
  const [situation, setSituation] = useState("")
  const [loading, setLoading] = useState(false)

  const emotionTones: EmotionTone[] = [
    {
      id: "angry",
      name: "Rage Mode",
      description: "Let out all your frustration and anger",
      color: "bg-red-500",
      prompt: "Write an angry departure message for someone who was fired from their job",
    },
    {
      id: "sad",
      name: "Tearful Goodbye",
      description: "Express your sadness and nostalgia",
      color: "bg-blue-500",
      prompt: "Write a sad, emotional goodbye message for leaving a job you loved",
    },
    {
      id: "happy",
      name: "Joyful Exit",
      description: "Celebrate your new beginning with joy",
      color: "bg-yellow-500",
      prompt: "Write a happy, optimistic departure message for someone starting a new chapter",
    },
    {
      id: "sarcastic",
      name: "Sarcastic Farewell",
      description: "Say goodbye with wit and sarcasm",
      color: "bg-purple-500",
      prompt: "Write a sarcastic, witty goodbye message for leaving a toxic workplace",
    },
    {
      id: "grateful",
      name: "Grateful Departure",
      description: "Express gratitude for the experience",
      color: "bg-green-500",
      prompt: "Write a grateful, appreciative goodbye message for leaving a team",
    },
    {
      id: "dramatic",
      name: "Dramatic Exit",
      description: "Make your exit as dramatic as possible",
      color: "bg-orange-500",
      prompt: "Write a dramatic, over-the-top goodbye message for ending a relationship",
    },
  ]

  const handleSubmit = async () => {
    if (!selectedTone || !situation) return

    setLoading(true)

    // Simulate API call to OpenAI
    setTimeout(() => {
      router.push("/loading")
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-4">
      <div className="container mx-auto max-w-4xl py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-2 text-center">Create Your End Page</h1>
          <p className="text-xl text-center mb-10 text-gray-300">
            Tell us about your departure and choose how you want to express it
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-none text-white">
              <CardHeader>
                <CardTitle>What are you leaving?</CardTitle>
                <CardDescription className="text-gray-300">Tell us about your situation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="situation">Describe your departure</Label>
                    <Textarea
                      id="situation"
                      placeholder="E.g., Leaving my job after 5 years, Breaking up with my partner..."
                      className="bg-white/5 border-white/20 text-white"
                      value={situation}
                      onChange={(e) => setSituation(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Choose your emotional tone</Label>
                    <RadioGroup
                      value={selectedTone || ""}
                      onValueChange={setSelectedTone}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2"
                    >
                      {emotionTones.map((tone) => {
                        const Icon = getIconForTone(tone.id)
                        return (
                          <div key={tone.id} className="relative">
                            <RadioGroupItem value={tone.id} id={tone.id} className="peer sr-only" />
                            <Label
                              htmlFor={tone.id}
                              className={`flex items-center gap-2 p-3 rounded-md border border-white/20 cursor-pointer hover:bg-white/10 transition-colors peer-data-[state=checked]:border-2 peer-data-[state=checked]:border-${tone.color.split("-")[1]}-500`}
                            >
                              <div className={`${tone.color} p-2 rounded-md`}>
                                <Icon size={16} />
                              </div>
                              <div>
                                <p className="font-medium">{tone.name}</p>
                                <p className="text-xs text-gray-300">{tone.description}</p>
                              </div>
                            </Label>
                          </div>
                        )
                      })}
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedTone || !situation || loading}
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600"
                >
                  {loading ? "Processing..." : "Generate My End Page"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <TonePreview selectedTone={selectedTone} tones={emotionTones} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
