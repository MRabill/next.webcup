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
import { ArrowLeft, ArrowRight, Save, CheckCircle, Smile, Users, MessageCircle, Image, Sparkles, Eye } from "lucide-react"
import { moods } from "@/lib/data"
import ConstellationBackground from "@/components/effects/constellation-background"
import MoodTransition from "@/components/effects/mood-transition"
import AudioPlayer from "@/components/ui/audio-player"
import { getMusicForMood } from "@/lib/music"
import { HeartfeltAnimation } from "@/components/effects/transitions/heart-effect"
import React from "react"

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
    // Save the form data to localStorage before navigating
    import('@/lib/exit-page-store').then(({ saveExitPageData }) => {
      saveExitPageData(formData);
      // Navigate to the preview page
      router.push("/preview");
    });
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

  const stepIcons: Record<string, React.ReactNode> = {
    mood: <Smile className="h-5 w-5" />,
    context: <Users className="h-5 w-5" />,
    message: <MessageCircle className="h-5 w-5" />,
    media: <Image className="h-5 w-5" />,
    effects: <Sparkles className="h-5 w-5" />,
    preview: <Eye className="h-5 w-5" />,
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-black to-slate-950 text-white relative overflow-hidden`}
    >
      {/* Constellation background */}
      <ConstellationBackground
        dotColor="rgba(255, 255, 255, 0.8)"
        lineColor="rgba(255, 255, 255, 0.2)"
        dotCount={380}
        className="z-0"
        mood={formData.mood}
      />

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

      {/* Subtle mood color overlay */}
      {formData.mood === "heartfelt" && (
        <div className="fixed inset-0 z-10 pointer-events-none bg-gradient-to-br from-pink-500/20 to-purple-500/20 transition-all duration-700" />
      )}
      {formData.mood === "sad" && (
        <div className="fixed inset-0 z-10 pointer-events-none bg-gradient-to-br from-blue-500/20 to-indigo-500/20 transition-all duration-700" />
      )}
      {formData.mood === "calm" && (
        <div className="fixed inset-0 z-10 pointer-events-none bg-gradient-to-br from-green-400/20 to-teal-500/20 transition-all duration-700" />
      )}
      {formData.mood === "robotic" && (
        <div className="fixed inset-0 z-10 pointer-events-none bg-gradient-to-br from-slate-400/20 to-slate-700/20 transition-all duration-700" />
      )}
      {formData.mood === "rage" && (
        <div className="fixed inset-0 z-10 pointer-events-none bg-gradient-to-br from-red-600/20 to-orange-500/20 transition-all duration-700" />
      )}
      {formData.mood === "funny" && (
        <div className="fixed inset-0 z-10 pointer-events-none bg-gradient-to-br from-yellow-400/20 to-orange-400/20 transition-all duration-700" />
      )}

      {/* Stepper/Progress Bar */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative px-4 pt-8 pb-2 z-20 max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex w-full">
                {tabs.map((tab, idx) => {
                  const isActive = activeTab === tab.id
                  const isCompleted = tabs.findIndex((t) => t.id === activeTab) > idx
                  return (
                    <div key={tab.id} className="flex-1 flex flex-col items-center relative">
                      <div className={`rounded-full flex items-center justify-center transition-all duration-300
                        ${isActive ? "bg-purple-500 text-white shadow-lg scale-110" : isCompleted ? "bg-green-500 text-white" : "bg-white/10 text-gray-300"}
                        h-10 w-10 mb-1 border-2 border-white/10`}
                      >
                        {isCompleted ? <CheckCircle className="h-5 w-5" /> : stepIcons[tab.id]}
                      </div>
                      <span className={`text-xs font-medium ${isActive ? "text-purple-300" : isCompleted ? "text-green-300" : "text-gray-400"}`}>{tab.label}</span>
                      {idx < tabs.length - 1 && (
                        <div className="absolute top-5 left-1/2 w-full h-1 -z-10">
                          <div className={`h-1 w-full mx-auto rounded bg-gradient-to-r
                            ${isCompleted ? "from-green-400 to-green-400" : isActive ? "from-purple-400 to-purple-400" : "from-white/10 to-white/10"}`}
                          ></div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-black/20 backdrop-blur-sm rounded-xl p-6 shadow-xl relative"
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
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={activeTab === "mood"}
                  className="bg-white/10 border-white/20 text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:border-transparent transition-all"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="bg-white/10 border-white/20 text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:border-transparent transition-all"
                >
                  Back to Home
                </Button>
              </div>
              {activeTab === "preview" ? (
                <Button
                  onClick={handlePublish}
                  variant="gradient"                >
                  <Save className="mr-2 h-4 w-4" />
                  Publish
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
