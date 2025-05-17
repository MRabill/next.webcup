"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Share2, Download, Edit, Plus, Send, ImageIcon, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import CommentSection from "@/components/comment-section"
import GifSelector from "@/components/gif-selector"
import EnhancedParticles from "@/components/effects/enhanced-particles"
import AudioPlayer from "@/components/ui/audio-player"
import { getMusicForMood } from "@/lib/music"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardPage() {
  const [showGifSelector, setShowGifSelector] = useState(false)
  const [selectedGif, setSelectedGif] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [mood, setMood] = useState("dramatic")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleGifSelect = (gifUrl: string) => {
    setSelectedGif(gifUrl)
    setShowGifSelector(false)
  }

  const handleSendComment = () => {
    // In a real app, this would send the comment to the backend
    setComment("")
    setSelectedGif(null)
  }

  const currentMusic = getMusicForMood(mood)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-white p-4 relative">
      {/* Background particles */}
      <EnhancedParticles mood={mood} intensity="low" />

      {/* Audio player */}
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

      <div className="container mx-auto max-w-6xl py-8 relative z-10">
        {/* Header with theme toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Exit Page</h1>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-none text-slate-900 dark:text-white mb-8 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                        My Dramatic Exit: The Final Curtain Call
                      </CardTitle>
                      <CardDescription className="text-slate-500 dark:text-gray-300 mt-2">
                        Created on May 17, 2025
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-slate-700 dark:text-white border-slate-300 dark:border-white/20"
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-slate-700 dark:text-white border-slate-300 dark:border-white/20"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-slate-700 dark:text-white border-slate-300 dark:border-white/20"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-lg leading-relaxed">
                      After 5 years of pouring my heart and soul into this company, it's time for the grand finale. This
                      isn't just a resignation; it's the closing act of a chapter that deserved a standing ovation but
                      got lukewarm applause instead.
                    </p>
                    <p className="text-lg leading-relaxed mt-4">
                      As I take my final bow, I'm not just walking away – I'm making an exit so spectacular, it'll be
                      remembered long after the lights dim on my empty desk. The spotlight may have shifted, but my
                      performance will echo in these halls.
                    </p>
                    <p className="text-lg leading-relaxed mt-4">
                      To those who supported me: thank you for being the audience that kept me going. To those who
                      didn't: watch as I steal the show one last time.
                    </p>
                    <p className="text-lg leading-relaxed mt-4 font-bold">
                      The curtain falls, but my story continues on a grander stage.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-none text-slate-900 dark:text-white shadow-lg">
                <CardHeader>
                  <CardTitle>Comments & Reactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <CommentSection />

                  <div className="mt-6">
                    <div className="flex gap-4 items-start">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Add your comment..."
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-white/20 text-slate-900 dark:text-white mb-2"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />

                        {selectedGif && (
                          <div className="relative mb-2 rounded-md overflow-hidden">
                            <img
                              src={selectedGif || "/placeholder.svg"}
                              alt="Selected GIF"
                              className="w-full max-h-60 object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => setSelectedGif(null)}
                            >
                              Remove
                            </Button>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-600 dark:text-gray-300"
                              onClick={() => setShowGifSelector(!showGifSelector)}
                            >
                              <ImageIcon className="mr-2 h-4 w-4" />
                              GIF
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate-600 dark:text-gray-300">
                              <Smile className="mr-2 h-4 w-4" />
                              Emoji
                            </Button>
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            disabled={!comment && !selectedGif}
                            onClick={handleSendComment}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Send
                          </Button>
                        </div>

                        {showGifSelector && (
                          <div className="mt-2">
                            <GifSelector onSelect={handleGifSelect} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Tabs defaultValue="customize" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/20 dark:bg-white/10">
                  <TabsTrigger value="customize">Customize</TabsTrigger>
                  <TabsTrigger value="share">Share</TabsTrigger>
                </TabsList>
                <TabsContent value="customize">
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-none text-slate-900 dark:text-white shadow-lg">
                    <CardHeader>
                      <CardTitle>Customize Your Page</CardTitle>
                      <CardDescription className="text-slate-500 dark:text-gray-300">
                        Add more elements to make it yours
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button className="w-full justify-start" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Background Music
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Background Image
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Animation Effects
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Video Message
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="share">
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-none text-slate-900 dark:text-white shadow-lg">
                    <CardHeader>
                      <CardTitle>Share Your End Page</CardTitle>
                      <CardDescription className="text-slate-500 dark:text-gray-300">
                        Let others see your final word
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="page-url">Your unique URL</Label>
                        <div className="flex mt-1.5">
                          <Input
                            id="page-url"
                            value="theend.page/my-dramatic-exit"
                            readOnly
                            className="bg-white/50 dark:bg-slate-700/50 border-slate-300 dark:border-white/20 text-slate-900 dark:text-white"
                          />
                          <Button className="ml-2">Copy</Button>
                        </div>
                      </div>

                      <div className="pt-4">
                        <p className="mb-3 font-medium">Share directly</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5 text-blue-400"
                            >
                              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                          </Button>
                          <Button variant="outline" size="icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5 text-sky-400"
                            >
                              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                            </svg>
                          </Button>
                          <Button variant="outline" size="icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5 text-green-400"
                            >
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                          </Button>
                          <Button variant="outline" size="icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5 text-purple-400"
                            >
                              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                            </svg>
                          </Button>
                          <Button variant="outline" size="icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5 text-red-400"
                            >
                              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-none text-slate-900 dark:text-white mt-6 shadow-lg">
                <CardHeader>
                  <CardTitle>Page Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Views</span>
                      <span className="font-bold">124</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Comments</span>
                      <span className="font-bold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reactions</span>
                      <span className="font-bold">32</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shares</span>
                      <span className="font-bold">15</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
