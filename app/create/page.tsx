"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MoodSelector from "@/components/create/mood-selector"
import RelationshipContext from "@/components/create/relationship-context"
import MessageGenerator from "@/components/create/message-generator"
import MediaSelector from "@/components/create/media-selector"
import EffectsSelector from "@/components/create/effects-selector"
import FinalPreview from "@/components/create/final-preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Save } from "lucide-react"
import { moods } from "@/lib/data"
import ParticlesBackground from "@/components/effects/particles-background"
import MoodTransition from "@/components/effects/mood-transition"
import AudioPlayer from "@/components/ui/audio-player"
import { getMusicForMood } from "@/lib/music"
import { HeartfeltAnimation } from "@/components/effects/transitions/heart-effect"

export default function CreatePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("mood")
  const [previousMood, setPreviousMood] = useState<string | undefined>(undefined)
  const [showMoodTransition, setShowMoodTransition] = useState(false)
  type FormData = {
    mood: string
    relationship: string
    context: string
    message: string
    gifs: string[]
    audio: string | null
    soundEffect: string | null
    visualEffects: string[]
    title: string
    username?: string
    email?: string
  }
  const [formData, setFormData] = useState<FormData>({
    mood: "",
    relationship: "",
    context: "",
    message: "",
    gifs: [],
    audio: null,
    soundEffect: null,
    visualEffects: [],
    title: "",
    username: "Anonymous User",  // Default username
    email: "anonymous@example.com"  // Default email
  })

  useEffect(() => {
    // Load user data from localStorage
    const storedUsername = localStorage.getItem("username")
    const storedEmail = localStorage.getItem("email")

    if (storedUsername) {
      setFormData((prev) => ({ ...prev, username: storedUsername }))
    }

    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }))
    }
  }, [])

  const tabs = [
    { id: "mood", label: "Mood" },
    { id: "context", label: "Context" },
    { id: "message", label: "Message" },
    { id: "media", label: "Media" },
    { id: "effects", label: "Effects" },
    { id: "preview", label: "Preview" },
  ]

  const handleNext = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id)
    }
  }

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id)
    }
  }

  const handlePublish = () => {
    // In a real app, this would save the data to a database
    // For now, we'll just navigate to a preview page
    router.push("/preview")
  }

  const updateFormData = (data: Partial<typeof formData>) => {
    // Check if mood is changing
    if (data.mood && data.mood !== formData.mood && formData.mood) {
      setPreviousMood(formData.mood)
      setShowMoodTransition(true)
    }

    setFormData((prev) => ({ ...prev, ...data }))
  }

  const isNextDisabled = () => {
    switch (activeTab) {
      case "mood":
        return !formData.mood
      case "context":
        return !formData.relationship || !formData.context
      case "message":
        return !formData.message
      default:
        return false
    }
  }

  const selectedMood = moods.find((m) => m.id === formData.mood)
  const currentMusic = formData.mood ? getMusicForMood(formData.mood) : getMusicForMood("default")

  // Load user data from localStorage when component mounts
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      const savedUsername = localStorage.getItem('endpage_username')
      const savedEmail = localStorage.getItem('endpage_email')
      
      if (savedUsername || savedEmail) {
        console.log('Loading user data from localStorage:', { savedUsername, savedEmail })
        setFormData(prev => ({
          ...prev,
          username: savedUsername || prev.username,
          email: savedEmail || prev.email
        }))
      }
    }
  }, [])

  // Handle mood transition completion
  const handleTransitionComplete = () => {
    setShowMoodTransition(false)
  }

  

  return (
    <div
      className={`min-h-screen transition-colors duration-1000 ${formData.mood === "heartfelt"
          ? "bg-gradient-to-b from-pink-900/30 to-slate-900"
          : formData.mood === "rage"
            ? "bg-gradient-to-b from-red-900/30 to-slate-900"
            : formData.mood === "funny"
              ? "bg-gradient-to-b from-yellow-900/30 to-slate-900"
              : formData.mood === "sad"
                ? "bg-gradient-to-b from-blue-900/30 to-slate-900"
                : formData.mood === "calm"
                  ? "bg-gradient-to-b from-green-900/30 to-slate-900"
                  : formData.mood === "robotic"
                    ? "bg-gradient-to-b from-slate-800/30 to-slate-900"
                    : "bg-gradient-to-b from-slate-900 to-slate-800"
        } text-white relative overflow-hidden`}
    >
      {/* Particles background */}
      <ParticlesBackground mood={formData.mood || "default"} intensity="low" />

      {/* Mood transition effect */}
      <MoodTransition
        mood={formData.mood}
        previousMood={previousMood}
        isActive={showMoodTransition}
        onComplete={handleTransitionComplete}
      />

      {/* Heartfelt Animation (only on heartfelt mood and mood tab) */}
      <HeartfeltAnimation isActive={formData.mood === "heartfelt" && activeTab === "mood"} />

      {/* Background music */}
      <AudioPlayer
        src={currentMusic.src}
        autoPlay={!!formData.mood}
        loop={true}
        volume={0.2}
        className="fixed bottom-4 right-4 z-50"
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-lg font-bold">Create Your End Page</h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-white/10 rounded-lg mb-8 backdrop-blur-sm">
                {tabs.map((tab, index) => {
                  const currentIndex = tabs.findIndex((t) => t.id === activeTab)

                  // Disable future tabs unless current or before
                  const isDisabled =
                    index > currentIndex &&
                    (
                      (activeTab === "mood" && !formData.mood) ||
                      (activeTab === "context" && (!formData.relationship || !formData.context)) ||
                      (activeTab === "message" && !formData.message)
                    )

                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      disabled={isDisabled}
                      className="data-[state=active]:bg-white/20 transition-all duration-300"
                    >
                      {tab.label}
                    </TabsTrigger>
                  )
                })}

              </TabsList>
            </motion.div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-black/20 backdrop-blur-sm rounded-xl p-6 shadow-xl"
            >
              <TabsContent value="mood" className="mt-0">
                <MoodSelector selectedMood={formData.mood} onSelect={(mood) => updateFormData({ mood })} />
              </TabsContent>

              <TabsContent value="context" className="mt-0">
                <RelationshipContext
                  relationship={formData.relationship}
                  context={formData.context}
                  onUpdate={(data) => updateFormData(data)}
                />
              </TabsContent>

              <TabsContent value="message" className="mt-0">
                <MessageGenerator
                  mood={formData.mood}
                  relationship={formData.relationship}
                  context={formData.context}
                  message={formData.message}
                  title={formData.title}
                  onUpdate={(data) => updateFormData(data)}
                  username={formData.username}
                  email={formData.email}
                />
              </TabsContent>

              <TabsContent value="media" className="mt-0">
                <MediaSelector
                  gifs={formData.gifs}
                  audio={formData.audio}
                  soundEffect={formData.soundEffect}
                  onUpdate={(data) => updateFormData(data)}
                />
              </TabsContent>

              <TabsContent value="effects" className="mt-0">
                <EffectsSelector
                  mood={formData.mood}
                  visualEffects={formData.visualEffects}
                  onUpdate={(data) => updateFormData(data)}
                />
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <FinalPreview formData={formData} />
              </TabsContent>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-between mt-8"
            >
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={activeTab === "mood"}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {activeTab === "preview" ? (
                <Button
                  onClick={handlePublish}
                  className="bg-gradient-to-r from-green-500 to-emerald-700 hover:from-green-600 hover:to-emerald-800"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Publish Exit Page
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={isNextDisabled()} variant="gradient">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </motion.div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
