"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Share2, Volume2, VolumeX } from "lucide-react"
import EffectPreview from "@/components/create/effect-preview"

interface FinalPreviewProps {
  formData: {
    mood: string
    relationship: string
    context: string
    message: string
    gifs: string[]
    audio: string | null
    soundEffect: string | null
    visualEffects: string[]
    title: string
  }
}

export default function FinalPreview({ formData }: FinalPreviewProps) {
  const [activeTab, setActiveTab] = useState("desktop")
  const [isMuted, setIsMuted] = useState(false)

  const handleCopyLink = () => {
    // In a real app, this would copy a link to the clipboard
    alert("Link copied to clipboard!")
  }

  const handleShare = () => {
    // In a real app, this would open a share dialog
    alert("Share dialog opened!")
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Preview Your Exit Page</h2>
        <p className="text-gray-300">This is how your exit page will look when published.</p>
      </div>

      <Tabs defaultValue="desktop" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid grid-cols-2 bg-white/10 rounded-lg mb-4 w-[200px] mx-auto">
          <TabsTrigger value="desktop" className="data-[state=active]:bg-white/20">
            Desktop
          </TabsTrigger>
          <TabsTrigger value="mobile" className="data-[state=active]:bg-white/20">
            Mobile
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex justify-center">
        <div
          className={`relative overflow-hidden rounded-lg shadow-2xl ${
            activeTab === "desktop" ? "w-full max-w-4xl" : "w-[375px]"
          }`}
        >
          <div
            className={`relative ${
              formData.mood === "heartfelt"
                ? "bg-gradient-to-br from-pink-500/20 to-purple-500/20"
                : formData.mood === "rage"
                  ? "bg-gradient-to-br from-red-600/20 to-orange-500/20"
                  : formData.mood === "funny"
                    ? "bg-gradient-to-br from-yellow-400/20 to-orange-400/20"
                    : formData.mood === "sad"
                      ? "bg-gradient-to-br from-blue-500/20 to-indigo-500/20"
                      : formData.mood === "calm"
                        ? "bg-gradient-to-br from-green-400/20 to-teal-500/20"
                        : "bg-gradient-to-br from-slate-600/20 to-slate-700/20"
            } min-h-[600px]`}
          >
            {/* Visual effects layer */}
            <div className="absolute inset-0 pointer-events-none">
              <EffectPreview mood={formData.mood} effects={formData.visualEffects} />
            </div>

            {/* Content */}
            <div className="relative z-10 p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-sm text-gray-400">theend.page</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1
                  className={`text-3xl md:text-4xl font-bold mb-6 ${
                    formData.mood === "heartfelt"
                      ? "text-pink-400"
                      : formData.mood === "rage"
                        ? "text-red-500"
                        : formData.mood === "funny"
                          ? "text-yellow-400"
                          : formData.mood === "sad"
                            ? "text-blue-400"
                            : formData.mood === "calm"
                              ? "text-green-400"
                              : "text-slate-400"
                  }`}
                >
                  {formData.title || "My Final Goodbye"}
                </h1>

                <div className="prose prose-invert max-w-none mb-8">
                  {formData.message.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {formData.gifs.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {formData.gifs.map((gif, index) => (
                      <Card key={index} className="overflow-hidden bg-transparent border-none">
                        <CardContent className="p-0">
                          <img src={gif || "/placeholder.svg"} alt={`GIF ${index + 1}`} className="w-full rounded-lg" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="mt-12 text-center">
                  <p className="text-sm text-gray-400">
                    This exit page was created on {new Date().toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
