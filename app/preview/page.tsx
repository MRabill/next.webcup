"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Share2, Volume2, VolumeX, ArrowLeft, Heart, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import EnhancedParticles from "@/components/effects/enhanced-particles"
import AudioPlayer from "@/components/ui/audio-player"
import { getMusicForMood } from "@/lib/music"
import { ThemeToggle } from "@/components/theme-toggle"
import MoodTransition from "@/components/effects/mood-transition"

export default function PreviewPage() {
  const router = useRouter()
  const [isMuted, setIsMuted] = useState(false)
  const [comment, setComment] = useState("")
  const [mood, setMood] = useState("dramatic")
  const [isLoaded, setIsLoaded] = useState(false)
  const [likedComments, setLikedComments] = useState<number[]>([])
  const [previousMood, setPreviousMood] = useState<string | undefined>(undefined)
  const [showMoodTransition, setShowMoodTransition] = useState(false)

  // Mock comments data
  const [comments, setComments] = useState([
    {
      id: 1,
      author: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "This is such a powerful goodbye! I'm going to miss working with you.",
      timestamp: "2 hours ago",
      likes: 12,
    },
    {
      id: 2,
      author: {
        name: "Jamie Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "You always knew how to make an exit! Best of luck on your new journey.",
      timestamp: "1 hour ago",
      likes: 8,
    },
    {
      id: 3,
      author: {
        name: "Taylor Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "I'm speechless. This is the most dramatic exit I've ever seen!",
      timestamp: "45 minutes ago",
      likes: 5,
    },
  ])

  useEffect(() => {
    setIsLoaded(true)

    // Trigger mood transition effect
    setShowMoodTransition(true)
    setTimeout(() => setShowMoodTransition(false), 2000)

    // Simulate the "slam the door" effect
    const timer = setTimeout(() => {
      const doorSlam = new Audio("/sounds/door-slam.mp3")
      if (!isMuted) {
        doorSlam.volume = 0.3
        doorSlam.play().catch((err) => console.error("Failed to play sound:", err))
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [isMuted])

  const handleLikeComment = (id: number) => {
    if (likedComments.includes(id)) {
      // Unlike
      setComments(comments.map((comment) => (comment.id === id ? { ...comment, likes: comment.likes - 1 } : comment)))
      setLikedComments(likedComments.filter((commentId) => commentId !== id))
    } else {
      // Like
      setComments(comments.map((comment) => (comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment)))
      setLikedComments([...likedComments, id])
    }
  }

  const handleSendComment = () => {
    if (!comment.trim()) return

    const newComment = {
      id: comments.length + 1,
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: comment,
      timestamp: "Just now",
      likes: 0,
    }

    setComments([...comments, newComment])
    setComment("")
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleMoodChange = (newMood: string) => {
    setPreviousMood(mood)
    setMood(newMood)
    setShowMoodTransition(true)
    setTimeout(() => setShowMoodTransition(false), 2000)
  }

  const currentMusic = getMusicForMood(mood)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white relative overflow-hidden">
      {/* Background particles */}
      <EnhancedParticles mood={mood} intensity="low" />

      {/* Mood transition effect */}
      <MoodTransition mood={mood} previousMood={previousMood ?? undefined} isActive={showMoodTransition} />
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

      <div className="container mx-auto max-w-5xl px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => router.push("/create")} className="text-white hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Editor
          </Button>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleMoodChange("heartfelt")} className="text-xs">
                Heartfelt
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleMoodChange("rage")} className="text-xs">
                Rage
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleMoodChange("funny")} className="text-xs">
                Funny
              </Button>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content - left side */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 10 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-black/30 backdrop-blur-sm border-none overflow-hidden rounded-lg shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-xs text-gray-400">theend.page/my-dramatic-exit</p>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                        className="h-7 w-7 text-white hover:bg-white/10"
                      >
                        {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/10">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/10">
                        <Share2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                    <h1 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                      My Dramatic Exit: The Final Curtain Call
                    </h1>

                    <div className="prose prose-invert max-w-none mb-6">
                      <motion.p
                        className="text-sm md:text-base leading-relaxed mb-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        After 5 years of pouring my heart and soul into this company, it's time for the grand finale.
                        This isn't just a resignation; it's the closing act of a chapter that deserved a standing
                        ovation but got lukewarm applause instead.
                      </motion.p>

                      <motion.p
                        className="text-sm md:text-base leading-relaxed mb-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        As I take my final bow, I'm not just walking away – I'm making an exit so spectacular, it'll be
                        remembered long after the lights dim on my empty desk.
                      </motion.p>

                      <motion.p
                        className="text-sm md:text-base leading-relaxed mb-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                      >
                        To those who supported me: thank you for being the audience that kept me going. To those who
                        didn't: watch as I steal the show one last time.
                      </motion.p>

                      <motion.p
                        className="text-sm md:text-base leading-relaxed font-medium"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                      >
                        The curtain falls, but my story continues on a grander stage.
                      </motion.p>
                    </div>

                    {/* GIF section - smaller size */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      className="mb-6"
                    >
                      <img
                        src="https://media.giphy.com/media/l0MYGb1LuZ3n7dRnO/giphy.gif"
                        alt="Dramatic exit GIF"
                        className="w-full max-h-48 object-cover rounded-md"
                      />
                    </motion.div>

                    <div className="mt-6 text-center">
                      <p className="text-xs text-gray-400">
                        This exit page was created on {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Comments section - right side */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 10 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="bg-black/30 backdrop-blur-sm border-none rounded-lg shadow-lg sticky top-4">
                <CardContent className="p-4">
                  <h2 className="text-sm font-medium mb-3 flex items-center">
                    <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                    Comments
                  </h2>

                  <div className="space-y-3 mb-4 max-h-[350px] overflow-y-auto pr-1">
                    <AnimatePresence>
                      {comments.map((comment, index) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-white/5 rounded-md p-3"
                        >
                          <div className="flex items-start gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={"/placeholder.svg"} />
                              <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <p className="text-xs font-medium">{comment.author.name}</p>
                                <p className="text-[10px] text-gray-400">{comment.timestamp}</p>
                              </div>
                              <p className="text-xs text-gray-300 mt-0.5 break-words">{comment.content}</p>

                              <div className="flex items-center mt-1.5">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`h-6 px-2 text-[10px] ${likedComments.includes(comment.id) ? "text-pink-500" : "text-gray-400"}`}
                                  onClick={() => handleLikeComment(comment.id)}
                                >
                                  {likedComments.includes(comment.id) ? (
                                    <Heart className="h-3 w-3 mr-1 fill-pink-500 text-pink-500" />
                                  ) : (
                                    <Heart className="h-3 w-3 mr-1" />
                                  )}
                                  {comment.likes + (likedComments.includes(comment.id) ? 1 : 0)}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Add comment section - simplified */}
                  <div className="mt-3">
                    <div className="flex gap-2 items-center">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex gap-1">
                          <Input
                            placeholder="Add a comment..."
                            className="h-7 text-xs bg-white/10 border-white/10 text-white"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSendComment()
                              }
                            }}
                          />
                          <Button
                            variant="default"
                            size="sm"
                            disabled={!comment.trim()}
                            onClick={handleSendComment}
                            className="h-7 px-2 text-xs bg-white/20 hover:bg-white/30"
                          >
                            Send
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <Button onClick={() => router.push("/create")} className="bg-white/10 hover:bg-white/20 text-sm">
            Create Your Own Exit Page
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
