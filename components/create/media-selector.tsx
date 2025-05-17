"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Upload, X, Play, Pause, Volume2, VolumeX, Image as ImageIcon, Music, Sparkles } from "lucide-react"
import { soundEffects } from "@/lib/data"

interface MediaSelectorProps {
  gifs: string[]
  audio: string | null
  soundEffect: string | null
  onUpdate: (data: { gifs: string[]; audio: string | null; soundEffect: string | null }) => void
}

export default function MediaSelector({ gifs, audio, soundEffect, onUpdate }: MediaSelectorProps) {
  const [activeTab, setActiveTab] = useState("gifs")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGifs, setSelectedGifs] = useState<string[]>(gifs || [])
  const [selectedAudio, setSelectedAudio] = useState<string | null>(audio)
  const [selectedSoundEffect, setSelectedSoundEffect] = useState<string | null>(soundEffect)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // Mock GIFs for the demo
  const mockGifs = [
    "https://media.giphy.com/media/l0MYGb1LuZ3n7dRnO/giphy.gif",
    "https://media.giphy.com/media/3o7btQsLqXMJAPu6Na/giphy.gif",
    "https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif",
    "https://media.giphy.com/media/l378rrt5tAawaCQ9i/giphy.gif",
    "https://media.giphy.com/media/l0HlDJhyI8qoh7Wfu/giphy.gif",
    "https://media.giphy.com/media/3o7btQMdq4a44tXod2/giphy.gif",
    "https://media.giphy.com/media/3o7btPCwlw9CaFH9Cg/giphy.gif",
    "https://media.giphy.com/media/3o7btSHUTdraHEsx0Y/giphy.gif",
  ]

  const handleGifSelect = (gif: string) => {
    if (selectedGifs.includes(gif)) {
      setSelectedGifs(selectedGifs.filter((g) => g !== gif))
    } else {
      setSelectedGifs([...selectedGifs, gif])
    }
    onUpdate({
      gifs: selectedGifs.includes(gif) ? selectedGifs.filter((g) => g !== gif) : [...selectedGifs, gif],
      audio: selectedAudio,
      soundEffect: selectedSoundEffect,
    })
  }

  const handleSoundEffectSelect = (effect: string) => {
    setSelectedSoundEffect(effect === selectedSoundEffect ? null : effect)
    onUpdate({ gifs: selectedGifs, audio: selectedAudio, soundEffect: effect === selectedSoundEffect ? null : effect })
  }

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload the file to a server
    // For now, we'll just pretend we have a URL
    if (e.target.files && e.target.files[0]) {
      const audioUrl = URL.createObjectURL(e.target.files[0])
      setSelectedAudio(audioUrl)
      onUpdate({ gifs: selectedGifs, audio: audioUrl, soundEffect: selectedSoundEffect })
    }
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div>
      {/* Animated/illustrated header */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
            animate={{ scale: [0.8, 1.1, 1], rotate: [0, 10, -10, 0], opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            <Sparkles className="h-8 w-8 text-yellow-400 drop-shadow-lg" />
          </motion.div>
          <h2 className="text-2xl font-bold">Add Media to Your Exit Page</h2>
        </div>
        <p className="text-gray-300">Enhance your message with GIFs, memes, and audio elements.</p>
      </div>

      <Tabs defaultValue="gifs" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 bg-white/10 rounded-lg mb-8">
          <TabsTrigger value="gifs" className="data-[state=active]:bg-white/20 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-yellow-400" /> GIFs & Memes
          </TabsTrigger>
          <TabsTrigger value="audio" className="data-[state=active]:bg-white/20 flex items-center gap-2">
            <Music className="h-5 w-5 text-blue-400" /> Audio & Sound
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gifs" className="mt-0">
          <Card className="bg-white/5 border-none">
            <CardHeader>
              <CardTitle>Search and Add GIFs</CardTitle>
              <CardDescription>Find the perfect GIFs to express your feelings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4 items-center">
                <motion.div
                  className="relative flex-1"
                  initial={{ boxShadow: "0 0 0 0px #facc15" }}
                  whileFocus={{ boxShadow: "0 0 0 3px #facc15" }}
                >
                  <Input
                    placeholder="Search GIFs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/5 border-white/20 text-white pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-400 pointer-events-none" />
                </motion.div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockGifs.map((gif, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 0 4px #facc15" }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative cursor-pointer rounded-md overflow-hidden border-2 ${
                      selectedGifs.includes(gif) ? "border-purple-500" : "border-transparent"
                    } hover:border-purple-500/50 transition-all`}
                    onClick={() => handleGifSelect(gif)}
                  >
                    <img
                      src={gif || "/placeholder.svg"}
                      alt={`GIF ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    {selectedGifs.includes(gif) && (
                      <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {selectedGifs.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Selected GIFs ({selectedGifs.length})</h3>
                  <div className="flex flex-wrap gap-4">
                    {selectedGifs.map((gif, index) => (
                      <div key={index} className="relative w-24 h-24">
                        <img
                          src={gif || "/placeholder.svg"}
                          alt={`Selected GIF ${index + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                          onClick={() => handleGifSelect(gif)}
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio" className="mt-0">
          <Card className="bg-white/5 border-none mb-6">
            <CardHeader>
              <CardTitle>Upload Voice Note</CardTitle>
              <CardDescription>Add a personal audio message to your exit page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-6 cursor-pointer hover:bg-white/5 transition-colors">
                  <Label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <span className="text-gray-300">Click to upload audio file</span>
                    <span className="text-xs text-gray-400 mt-1">MP3, WAV, or M4A (max 5MB)</span>
                    <Input
                      id="audio-upload"
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={handleAudioUpload}
                    />
                  </Label>
                </div>

                {selectedAudio && (
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="text-white" onClick={togglePlayback}>
                          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>
                        <div className="ml-2">
                          <p className="text-sm font-medium">Your Voice Note</p>
                          <p className="text-xs text-gray-400">0:00 / 0:30</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="text-white" onClick={toggleMute}>
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white"
                          onClick={() => {
                            setSelectedAudio(null)
                            onUpdate({ gifs: selectedGifs, audio: null, soundEffect: selectedSoundEffect })
                          }}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-1/3"></div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-none">
            <CardHeader>
              <CardTitle>Sound Effects</CardTitle>
              <CardDescription>Choose a dramatic sound effect for your exit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {soundEffects.map((effect) => (
                  <div
                    key={effect.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer border ${
                      selectedSoundEffect === effect.id
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/20 hover:bg-white/5"
                    }`}
                    onClick={() => handleSoundEffectSelect(effect.id)}
                  >
                    <Button variant="ghost" size="icon" className="mr-2">
                      <Play className="h-4 w-4" />
                    </Button>
                    <div>
                      <p className="font-medium">{effect.name}</p>
                      <p className="text-xs text-gray-400">Perfect for {effect.mood} exits</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
